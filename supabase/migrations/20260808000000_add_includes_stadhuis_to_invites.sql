ALTER TABLE public.invites
  ADD COLUMN IF NOT EXISTS includes_stadhuis boolean NOT NULL DEFAULT false;

ALTER TABLE public.invites
  ADD CONSTRAINT invites_stadhuis_requires_full_day
  CHECK (includes_stadhuis = false OR invitation_type = 'full_day');
