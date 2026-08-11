BEGIN;

CREATE TABLE public.rsvp_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code text NOT NULL,
  attendee_position smallint NOT NULL,
  name text,
  dietary_preference text NOT NULL DEFAULT 'none',
  notes text,
  details_complete boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rsvp_attendees_invite_code_fkey
    FOREIGN KEY (invite_code)
    REFERENCES public.invites (code)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT rsvp_attendees_position_check
    CHECK (attendee_position IN (1, 2)),
  CONSTRAINT rsvp_attendees_details_state_check
    CHECK (
      (
        details_complete = true
        AND name IS NOT NULL
        AND btrim(name) <> ''
        AND char_length(name) <= 150
      )
      OR
      (
        details_complete = false
        AND name IS NULL
        AND dietary_preference = 'none'
        AND notes IS NULL
      )
    ),
  CONSTRAINT rsvp_attendees_dietary_preference_check
    CHECK (dietary_preference IN ('none', 'vegetarian', 'vegan')),
  CONSTRAINT rsvp_attendees_notes_length_check
    CHECK (notes IS NULL OR char_length(notes) <= 500),
  CONSTRAINT rsvp_attendees_invite_position_key
    UNIQUE (invite_code, attendee_position)
);

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.rsvp_attendees
TO service_role;

REVOKE ALL PRIVILEGES
ON TABLE public.rsvp_attendees
FROM PUBLIC, anon, authenticated;

ALTER TABLE public.rsvp_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_attendees FORCE ROW LEVEL SECURITY;

-- There are deliberately no direct-table policies. All reads and writes use
-- the server-only service-role client, matching the existing invitation model.

-- Preserve historical attendance counts without inventing names. The existing
-- invitation constraints limit attending_guests to allowed_guests (1 or 2), so
-- this creates exactly one unresolved row for each recorded attendee.
INSERT INTO public.rsvp_attendees (
  invite_code,
  attendee_position,
  name,
  dietary_preference,
  notes,
  details_complete
)
SELECT
  invitation.code,
  position::smallint,
  NULL,
  'none',
  NULL,
  false
FROM public.invites AS invitation
CROSS JOIN LATERAL generate_series(
  1,
  invitation.attending_guests
) AS attendee_position(position)
WHERE invitation.answered = true
  AND invitation.attending_guests > 0;

CREATE FUNCTION public.set_rsvp_attendee_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL
ON FUNCTION public.set_rsvp_attendee_updated_at()
FROM PUBLIC, anon, authenticated;

CREATE TRIGGER set_rsvp_attendee_updated_at
BEFORE UPDATE ON public.rsvp_attendees
FOR EACH ROW
EXECUTE FUNCTION public.set_rsvp_attendee_updated_at();

CREATE FUNCTION public.check_invitation_rsvp_consistency()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  checked_code text;
  checked_codes text[];
  invitation_answered boolean;
  invitation_attending_guests integer;
  attendee_count integer;
BEGIN
  IF TG_TABLE_NAME = 'invites' THEN
    checked_codes := ARRAY[NEW.code];
  ELSIF TG_OP = 'DELETE' THEN
    checked_codes := ARRAY[OLD.invite_code];
  ELSIF TG_OP = 'UPDATE'
    AND OLD.invite_code IS DISTINCT FROM NEW.invite_code THEN
    checked_codes := ARRAY[OLD.invite_code, NEW.invite_code];
  ELSE
    checked_codes := ARRAY[NEW.invite_code];
  END IF;

  FOREACH checked_code IN ARRAY checked_codes
  LOOP
    SELECT answered, attending_guests
    INTO invitation_answered, invitation_attending_guests
    FROM public.invites
    WHERE code = checked_code;

    -- A missing old code is expected after an invitation-code cascade or
    -- invitation deletion. Any remaining invitation still gets checked.
    IF NOT FOUND THEN
      CONTINUE;
    END IF;

    SELECT count(*)::integer
    INTO attendee_count
    FROM public.rsvp_attendees
    WHERE invite_code = checked_code;

    IF invitation_answered = false THEN
      IF invitation_attending_guests IS NOT NULL OR attendee_count <> 0 THEN
        RAISE EXCEPTION 'Pending invitation % cannot have RSVP attendees', checked_code;
      END IF;
    ELSIF invitation_attending_guests IS NULL
      OR invitation_attending_guests <> attendee_count THEN
      RAISE EXCEPTION
        'Invitation % attendance count (%) does not match attendee rows (%)',
        checked_code,
        invitation_attending_guests,
        attendee_count;
    END IF;
  END LOOP;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL
ON FUNCTION public.check_invitation_rsvp_consistency()
FROM PUBLIC, anon, authenticated;

-- Deferred cross-table checks let the RPC replace person rows and the invite
-- count in either order while still enforcing a consistent state at commit.
CREATE CONSTRAINT TRIGGER invitation_rsvp_consistency_after_invite_change
AFTER INSERT OR UPDATE OF answered, attending_guests
ON public.invites
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.check_invitation_rsvp_consistency();

CREATE CONSTRAINT TRIGGER invitation_rsvp_consistency_after_attendee_change
AFTER INSERT OR UPDATE OR DELETE
ON public.rsvp_attendees
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.check_invitation_rsvp_consistency();

CREATE FUNCTION public.save_invitation_rsvp(
  p_invite_code text,
  p_answered boolean,
  p_attending_guests integer,
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
BEGIN
  IF p_invite_code IS NULL OR btrim(p_invite_code) = '' THEN
    RAISE EXCEPTION 'Invalid invitation code';
  END IF;

  IF p_answered IS NULL THEN
    RAISE EXCEPTION 'Answered state is required';
  END IF;

  IF p_attendees IS NULL OR jsonb_typeof(p_attendees) <> 'array' THEN
    RAISE EXCEPTION 'Attendees must be a JSON array';
  END IF;

  SELECT *
  INTO invitation_record
  FROM public.invites
  WHERE code = p_invite_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;

  IF p_answered = false THEN
    IF p_attending_guests IS NOT NULL OR jsonb_array_length(p_attendees) <> 0 THEN
      RAISE EXCEPTION 'Pending RSVP cannot contain attendance data';
    END IF;
  ELSE
    IF p_attending_guests IS NULL
      OR p_attending_guests < 0
      OR p_attending_guests > 2
      OR p_attending_guests > invitation_record.allowed_guests THEN
      RAISE EXCEPTION 'Invalid attendee count';
    END IF;

    IF jsonb_array_length(p_attendees) <> p_attending_guests THEN
      RAISE EXCEPTION 'Attendee details do not match attendee count';
    END IF;
  END IF;

  DELETE FROM public.rsvp_attendees
  WHERE invite_code = invitation_record.code;

  IF p_answered = true THEN
    FOR attendee_record IN
      SELECT value, ordinality
      FROM jsonb_array_elements(p_attendees) WITH ORDINALITY
    LOOP
      IF jsonb_typeof(attendee_record.value) <> 'object'
        OR jsonb_typeof(attendee_record.value -> 'name') <> 'string'
        OR jsonb_typeof(attendee_record.value -> 'dietary_preference') <> 'string'
        OR (
          attendee_record.value ? 'notes'
          AND attendee_record.value -> 'notes' <> 'null'::jsonb
          AND jsonb_typeof(attendee_record.value -> 'notes') <> 'string'
        ) THEN
        RAISE EXCEPTION 'Invalid attendee details';
      END IF;

      attendee_name := btrim(attendee_record.value ->> 'name');
      attendee_dietary_preference :=
        attendee_record.value ->> 'dietary_preference';
      attendee_notes := nullif(
        btrim(COALESCE(attendee_record.value ->> 'notes', '')),
        ''
      );

      IF attendee_name = '' OR char_length(attendee_name) > 150 THEN
        RAISE EXCEPTION 'Invalid attendee name';
      END IF;

      IF attendee_dietary_preference NOT IN ('none', 'vegetarian', 'vegan') THEN
        RAISE EXCEPTION 'Invalid dietary preference';
      END IF;

      IF attendee_notes IS NOT NULL AND char_length(attendee_notes) > 500 THEN
        RAISE EXCEPTION 'Attendee notes are too long';
      END IF;

      INSERT INTO public.rsvp_attendees (
        invite_code,
        attendee_position,
        name,
        dietary_preference,
        notes,
        details_complete
      )
      VALUES (
        invitation_record.code,
        attendee_record.ordinality,
        attendee_name,
        attendee_dietary_preference,
        attendee_notes,
        true
      );
    END LOOP;
  END IF;

  UPDATE public.invites
  SET
    answered = p_answered,
    attending_guests = p_attending_guests
  WHERE code = invitation_record.code;

  RETURN invitation_record.code;
END;
$$;

REVOKE ALL
ON FUNCTION public.save_invitation_rsvp(text, boolean, integer, jsonb)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE
ON FUNCTION public.save_invitation_rsvp(text, boolean, integer, jsonb)
TO service_role;

COMMENT ON TABLE public.rsvp_attendees IS
  'Normalized per-person RSVP details. Direct browser access is denied.';

COMMENT ON FUNCTION public.save_invitation_rsvp(text, boolean, integer, jsonb) IS
  'Atomically replaces attendee rows and updates the invitation RSVP state.';

COMMIT;
