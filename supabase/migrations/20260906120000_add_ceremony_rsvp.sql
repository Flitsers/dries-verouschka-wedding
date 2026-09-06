BEGIN;

ALTER TABLE public.invites
  ADD COLUMN ceremony_attending boolean;

-- Preserve positive historical answers as unresolved. A declined RSVP is never
-- a ceremony attendance answer, while non-full-day invitations are not eligible.
UPDATE public.invites
SET ceremony_attending = false
WHERE answered = true
  AND attending_guests = 0
  AND invitation_type = 'full_day';

UPDATE public.invites
SET ceremony_attending = NULL
WHERE invitation_type <> 'full_day';

ALTER TABLE public.invites
  ADD CONSTRAINT invites_ceremony_rsvp_state_check
  CHECK (
    ceremony_attending IS NULL
    OR (
      invitation_type = 'full_day'
      AND answered = true
      AND attending_guests IS NOT NULL
      AND (ceremony_attending = false OR attending_guests > 0)
    )
  );

COMMENT ON COLUMN public.invites.ceremony_attending IS
  'Nullable ceremony RSVP for full-day invitations. NULL means not yet provided or not applicable.';

DROP FUNCTION public.save_invitation_rsvp(text, boolean, integer, boolean, jsonb);

CREATE FUNCTION public.save_invitation_rsvp(
  p_invite_code text,
  p_answered boolean,
  p_attending_guests integer,
  p_stadhuis_attending boolean,
  p_ceremony_attending boolean,
  p_attendees jsonb
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  invitation_record public.invites%ROWTYPE;
  attendee_record record;
  attendee_name text;
  attendee_dietary_preference text;
  attendee_notes text;
  attendee_song_request text;
BEGIN
  IF p_invite_code IS NULL OR btrim(p_invite_code) = '' THEN
    RAISE EXCEPTION 'Invalid invitation code';
  END IF;
  IF p_answered IS NULL THEN RAISE EXCEPTION 'Answered state is required'; END IF;
  IF p_attendees IS NULL OR jsonb_typeof(p_attendees) <> 'array' THEN
    RAISE EXCEPTION 'Attendees must be a JSON array';
  END IF;

  SELECT * INTO invitation_record
  FROM public.invites WHERE code = p_invite_code FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Invitation not found'; END IF;

  IF p_answered = false THEN
    IF p_attending_guests IS NOT NULL OR p_stadhuis_attending IS NOT NULL
      OR p_ceremony_attending IS NOT NULL OR jsonb_array_length(p_attendees) <> 0 THEN
      RAISE EXCEPTION 'Pending RSVP cannot contain attendance data';
    END IF;
  ELSE
    IF p_attending_guests IS NULL OR p_attending_guests < 0
      OR p_attending_guests > 2 OR p_attending_guests > invitation_record.allowed_guests
      OR jsonb_array_length(p_attendees) <> p_attending_guests THEN
      RAISE EXCEPTION 'Invalid attendee count';
    END IF;
    IF invitation_record.includes_stadhuis = false THEN
      IF p_stadhuis_attending IS NOT NULL THEN RAISE EXCEPTION 'Stadhuis response is not applicable'; END IF;
    ELSIF p_attending_guests = 0 THEN
      IF p_stadhuis_attending IS DISTINCT FROM false THEN RAISE EXCEPTION 'Declined RSVP requires declined Stadhuis response'; END IF;
    ELSIF p_stadhuis_attending IS NULL THEN
      RAISE EXCEPTION 'Stadhuis response is required';
    END IF;
    IF invitation_record.invitation_type <> 'full_day' THEN
      IF p_ceremony_attending IS NOT NULL THEN RAISE EXCEPTION 'Ceremony response is not applicable'; END IF;
    ELSIF p_attending_guests = 0 THEN
      IF p_ceremony_attending IS DISTINCT FROM false THEN RAISE EXCEPTION 'Declined RSVP requires declined ceremony response'; END IF;
    ELSIF p_ceremony_attending IS NULL THEN
      RAISE EXCEPTION 'Ceremony response is required';
    END IF;
  END IF;

  DELETE FROM public.rsvp_attendees WHERE invite_code = invitation_record.code;
  IF p_answered = true THEN
    FOR attendee_record IN SELECT value, ordinality FROM jsonb_array_elements(p_attendees) WITH ORDINALITY LOOP
      IF jsonb_typeof(attendee_record.value) <> 'object'
        OR jsonb_typeof(attendee_record.value -> 'name') <> 'string'
        OR jsonb_typeof(attendee_record.value -> 'dietary_preference') <> 'string'
        OR (attendee_record.value ? 'notes' AND attendee_record.value -> 'notes' <> 'null'::jsonb AND jsonb_typeof(attendee_record.value -> 'notes') <> 'string')
        OR (attendee_record.value ? 'song_request' AND attendee_record.value -> 'song_request' <> 'null'::jsonb AND jsonb_typeof(attendee_record.value -> 'song_request') <> 'string') THEN
        RAISE EXCEPTION 'Invalid attendee details';
      END IF;
      attendee_name := btrim(attendee_record.value ->> 'name');
      attendee_dietary_preference := attendee_record.value ->> 'dietary_preference';
      attendee_notes := nullif(btrim(COALESCE(attendee_record.value ->> 'notes', '')), '');
      attendee_song_request := nullif(btrim(COALESCE(attendee_record.value ->> 'song_request', '')), '');
      IF attendee_name = '' OR char_length(attendee_name) > 150 THEN RAISE EXCEPTION 'Invalid attendee name'; END IF;
      IF attendee_dietary_preference NOT IN ('none', 'vegetarian', 'vegan') THEN RAISE EXCEPTION 'Invalid dietary preference'; END IF;
      IF attendee_notes IS NOT NULL AND char_length(attendee_notes) > 500 THEN RAISE EXCEPTION 'Attendee notes are too long'; END IF;
      IF attendee_song_request IS NOT NULL AND char_length(attendee_song_request) > 200 THEN RAISE EXCEPTION 'Attendee song request is too long'; END IF;
      INSERT INTO public.rsvp_attendees (invite_code, attendee_position, name, dietary_preference, notes, song_request, details_complete)
      VALUES (invitation_record.code, attendee_record.ordinality, attendee_name, attendee_dietary_preference, attendee_notes, attendee_song_request, true);
    END LOOP;
  END IF;

  UPDATE public.invites SET answered = p_answered, attending_guests = p_attending_guests,
    stadhuis_attending = p_stadhuis_attending, ceremony_attending = p_ceremony_attending
  WHERE code = invitation_record.code;
  RETURN invitation_record.code;
END;
$$;

REVOKE ALL ON FUNCTION public.save_invitation_rsvp(text, boolean, integer, boolean, boolean, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_invitation_rsvp(text, boolean, integer, boolean, boolean, jsonb) TO service_role;

COMMENT ON FUNCTION public.save_invitation_rsvp(text, boolean, integer, boolean, boolean, jsonb) IS
  'Atomically replaces attendee rows and updates wedding, Stadhuis, and ceremony RSVP state.';

COMMIT;
