ALTER TABLE public.invites
  ADD COLUMN IF NOT EXISTS invitation_type text;

UPDATE public.invites
SET invitation_type = 'full_day'
WHERE invitation_type IS NULL;

ALTER TABLE public.invites
  ALTER COLUMN invitation_type SET DEFAULT 'full_day',
  ALTER COLUMN invitation_type SET NOT NULL;

ALTER TABLE public.invites
  DROP CONSTRAINT IF EXISTS invites_invitation_type_check;

ALTER TABLE public.invites
  ADD CONSTRAINT invites_invitation_type_check
  CHECK (invitation_type IN ('full_day', 'reception_plus', 'evening_only'));
