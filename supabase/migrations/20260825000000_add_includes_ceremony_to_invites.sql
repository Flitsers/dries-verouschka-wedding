ALTER TABLE public.invites
  ADD COLUMN IF NOT EXISTS includes_ceremony boolean;

UPDATE public.invites
SET includes_ceremony = (invitation_type = 'full_day')
WHERE includes_ceremony IS NULL;

ALTER TABLE public.invites
  ALTER COLUMN includes_ceremony SET DEFAULT false,
  ALTER COLUMN includes_ceremony SET NOT NULL;
