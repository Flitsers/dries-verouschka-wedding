/*
Run this read-only preflight immediately before applying the migration.
Every result except total_invites must be zero. Do not silently repair rows.

SELECT
  count(*) AS total_invites,
  count(*) FILTER (
    WHERE code IS NULL OR btrim(code) = ''
  ) AS missing_codes,
  (
    SELECT count(*)
    FROM (
      SELECT code
      FROM public.invites
      GROUP BY code
      HAVING count(*) > 1
    ) AS duplicate_codes
  ) AS duplicate_code_groups,
  count(*) FILTER (
    WHERE allowed_guests IS NULL
       OR allowed_guests NOT IN (1, 2)
  ) AS invalid_allowed_guests,
  count(*) FILTER (
    WHERE answered IS NULL
  ) AS null_answered,
  count(*) FILTER (
    WHERE answered = false
      AND attending_guests IS NOT NULL
  ) AS invalid_pending_state,
  count(*) FILTER (
    WHERE answered = true
      AND attending_guests IS NULL
  ) AS answered_without_attending_count,
  count(*) FILTER (
    WHERE answered = true
      AND attending_guests IS NOT NULL
      AND (
        attending_guests < 0
        OR attending_guests > allowed_guests
      )
  ) AS invalid_attendance_capacity,
  count(*) FILTER (
    WHERE invitation_type IS NULL
       OR invitation_type NOT IN (
         'full_day',
         'reception_plus',
         'evening_only'
       )
  ) AS invalid_invitation_type,
  count(*) FILTER (
    WHERE includes_stadhuis IS NULL
       OR (
         includes_stadhuis = true
         AND invitation_type <> 'full_day'
       )
  ) AS invalid_stadhuis_configuration
FROM public.invites;
*/

BEGIN;

-- Admin operations use the server-only service-role client and do not depend
-- on public or authenticated table access.
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.invites, public.guests
TO service_role;

REVOKE ALL PRIVILEGES
ON TABLE public.invites, public.guests
FROM PUBLIC, anon, authenticated;

-- The service_role has BYPASSRLS. RLS therefore remains a second deny-by-
-- default boundary for every non-privileged role.
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites FORCE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests FORCE ROW LEVEL SECURITY;

-- No direct-table policies are needed after public access moves behind the
-- Next.js server-only invitation service. Privileges were revoked above as the
-- primary object-level boundary.
DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('invites', 'guests')
  LOOP
    EXECUTE format(
      'DROP POLICY %I ON %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  END LOOP;
END
$$;

-- These statements intentionally fail rather than rewrite incompatible data.
ALTER TABLE public.invites
  ALTER COLUMN code SET NOT NULL,
  ALTER COLUMN allowed_guests SET NOT NULL,
  ALTER COLUMN answered SET DEFAULT false,
  ALTER COLUMN answered SET NOT NULL,
  ALTER COLUMN invitation_type SET NOT NULL,
  ALTER COLUMN includes_stadhuis SET DEFAULT false,
  ALTER COLUMN includes_stadhuis SET NOT NULL;

DO $$
DECLARE
  code_attnum smallint;
BEGIN
  SELECT attnum::smallint
  INTO code_attnum
  FROM pg_attribute
  WHERE attrelid = 'public.invites'::regclass
    AND attname = 'code'
    AND NOT attisdropped;

  IF code_attnum IS NULL THEN
    RAISE EXCEPTION 'public.invites.code does not exist';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint AS constraint_record
    WHERE constraint_record.conrelid = 'public.invites'::regclass
      AND constraint_record.contype = 'u'
      AND (
        constraint_record.conname IN (
          'invites_code_key',
          'invites_code_unique'
        )
        OR constraint_record.conkey = ARRAY[code_attnum]::smallint[]
      )
      AND constraint_record.conkey = ARRAY[code_attnum]::smallint[]
  ) THEN
    ALTER TABLE public.invites
      ADD CONSTRAINT invites_code_unique UNIQUE (code);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint AS constraint_record
    WHERE constraint_record.conrelid = 'public.invites'::regclass
      AND constraint_record.contype = 'c'
      AND (
        constraint_record.conname IN (
          'invites_allowed_guests_one_or_two_check',
          'invites_allowed_guests_check'
        )
        OR (
          lower(pg_get_constraintdef(constraint_record.oid)) LIKE '%allowed_guests%'
          AND (
            regexp_replace(
              lower(pg_get_constraintdef(constraint_record.oid)),
              '\s+',
              '',
              'g'
            ) LIKE '%allowed_guests=any(array[1,2])%'
            OR (
              regexp_replace(
                lower(pg_get_constraintdef(constraint_record.oid)),
                '\s+',
                '',
                'g'
              ) LIKE '%allowed_guests=1%'
              AND regexp_replace(
                lower(pg_get_constraintdef(constraint_record.oid)),
                '\s+',
                '',
                'g'
              ) LIKE '%allowed_guests=2%'
            )
          )
        )
      )
  ) THEN
    ALTER TABLE public.invites
      ADD CONSTRAINT invites_allowed_guests_check
      CHECK (allowed_guests IN (1, 2))
      NOT VALID;
  END IF;
END
$$;

-- Keep invites_attending_guests_range_check in place. It independently guards
-- the numeric range, while this stricter constraint also enforces the
-- answered/pending null-state semantics.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint AS constraint_record
    WHERE constraint_record.conrelid = 'public.invites'::regclass
      AND constraint_record.contype = 'c'
      AND (
        constraint_record.conname = 'invites_rsvp_state_check'
        OR (
          regexp_replace(
            lower(pg_get_constraintdef(constraint_record.oid)),
            '\s+',
            '',
            'g'
          ) LIKE '%answered=false%'
          AND regexp_replace(
            lower(pg_get_constraintdef(constraint_record.oid)),
            '\s+',
            '',
            'g'
          ) LIKE '%attending_guestsisnull%'
          AND regexp_replace(
            lower(pg_get_constraintdef(constraint_record.oid)),
            '\s+',
            '',
            'g'
          ) LIKE '%answered=true%'
          AND regexp_replace(
            lower(pg_get_constraintdef(constraint_record.oid)),
            '\s+',
            '',
            'g'
          ) LIKE '%attending_guestsisnotnull%'
          AND regexp_replace(
            lower(pg_get_constraintdef(constraint_record.oid)),
            '\s+',
            '',
            'g'
          ) LIKE '%attending_guests>=0%'
          AND regexp_replace(
            lower(pg_get_constraintdef(constraint_record.oid)),
            '\s+',
            '',
            'g'
          ) LIKE '%attending_guests<=allowed_guests%'
        )
      )
  ) THEN
    ALTER TABLE public.invites
      ADD CONSTRAINT invites_rsvp_state_check
      CHECK (
        (
          answered = false
          AND attending_guests IS NULL
        )
        OR
        (
          answered = true
          AND attending_guests IS NOT NULL
          AND attending_guests >= 0
          AND attending_guests <= allowed_guests
        )
      )
      NOT VALID;
  END IF;
END
$$;

-- These named constraints are created by the preceding source-controlled
-- migrations. Validation fails closed if the live schema/data has diverged.
ALTER TABLE public.invites
  VALIDATE CONSTRAINT invites_invitation_type_check;

DO $$
DECLARE
  stadhuis_constraint_name text;
BEGIN
  SELECT constraint_record.conname
  INTO stadhuis_constraint_name
  FROM pg_constraint AS constraint_record
  WHERE constraint_record.conrelid = 'public.invites'::regclass
    AND constraint_record.contype = 'c'
    AND (
      constraint_record.conname IN (
        'invites_includes_stadhuis_full_day_check',
        'invites_stadhuis_requires_full_day'
      )
      OR (
        lower(pg_get_constraintdef(constraint_record.oid)) LIKE '%includes_stadhuis%'
        AND lower(pg_get_constraintdef(constraint_record.oid)) LIKE '%invitation_type%'
        AND lower(pg_get_constraintdef(constraint_record.oid)) LIKE '%full_day%'
      )
    )
  ORDER BY CASE constraint_record.conname
    WHEN 'invites_includes_stadhuis_full_day_check' THEN 0
    WHEN 'invites_stadhuis_requires_full_day' THEN 1
    ELSE 2
  END
  LIMIT 1;

  IF stadhuis_constraint_name IS NULL THEN
    RAISE EXCEPTION 'No Stadhuis/full-day constraint exists on public.invites';
  END IF;

  EXECUTE format(
    'ALTER TABLE public.invites VALIDATE CONSTRAINT %I',
    stadhuis_constraint_name
  );
END
$$;

DO $$
DECLARE
  allowed_guests_constraint_name text;
BEGIN
  SELECT constraint_record.conname
  INTO allowed_guests_constraint_name
  FROM pg_constraint AS constraint_record
  WHERE constraint_record.conrelid = 'public.invites'::regclass
    AND constraint_record.contype = 'c'
    AND (
      constraint_record.conname IN (
        'invites_allowed_guests_one_or_two_check',
        'invites_allowed_guests_check'
      )
      OR (
        lower(pg_get_constraintdef(constraint_record.oid)) LIKE '%allowed_guests%'
        AND (
          regexp_replace(
            lower(pg_get_constraintdef(constraint_record.oid)),
            '\s+',
            '',
            'g'
          ) LIKE '%allowed_guests=any(array[1,2])%'
          OR (
            regexp_replace(
              lower(pg_get_constraintdef(constraint_record.oid)),
              '\s+',
              '',
              'g'
            ) LIKE '%allowed_guests=1%'
            AND regexp_replace(
              lower(pg_get_constraintdef(constraint_record.oid)),
              '\s+',
              '',
              'g'
            ) LIKE '%allowed_guests=2%'
          )
        )
      )
    )
  ORDER BY CASE constraint_record.conname
    WHEN 'invites_allowed_guests_one_or_two_check' THEN 0
    WHEN 'invites_allowed_guests_check' THEN 1
    ELSE 2
  END
  LIMIT 1;

  IF allowed_guests_constraint_name IS NULL THEN
    RAISE EXCEPTION 'No allowed_guests IN (1, 2) constraint exists on public.invites';
  END IF;

  EXECUTE format(
    'ALTER TABLE public.invites VALIDATE CONSTRAINT %I',
    allowed_guests_constraint_name
  );
END
$$;

DO $$
DECLARE
  rsvp_constraint_name text;
BEGIN
  SELECT constraint_record.conname
  INTO rsvp_constraint_name
  FROM pg_constraint AS constraint_record
  WHERE constraint_record.conrelid = 'public.invites'::regclass
    AND constraint_record.contype = 'c'
    AND (
      constraint_record.conname = 'invites_rsvp_state_check'
      OR (
        regexp_replace(
          lower(pg_get_constraintdef(constraint_record.oid)),
          '\s+',
          '',
          'g'
        ) LIKE '%answered=false%'
        AND regexp_replace(
          lower(pg_get_constraintdef(constraint_record.oid)),
          '\s+',
          '',
          'g'
        ) LIKE '%attending_guestsisnull%'
        AND regexp_replace(
          lower(pg_get_constraintdef(constraint_record.oid)),
          '\s+',
          '',
          'g'
        ) LIKE '%answered=true%'
        AND regexp_replace(
          lower(pg_get_constraintdef(constraint_record.oid)),
          '\s+',
          '',
          'g'
        ) LIKE '%attending_guestsisnotnull%'
        AND regexp_replace(
          lower(pg_get_constraintdef(constraint_record.oid)),
          '\s+',
          '',
          'g'
        ) LIKE '%attending_guests>=0%'
        AND regexp_replace(
          lower(pg_get_constraintdef(constraint_record.oid)),
          '\s+',
          '',
          'g'
        ) LIKE '%attending_guests<=allowed_guests%'
      )
    )
  ORDER BY CASE constraint_record.conname
    WHEN 'invites_rsvp_state_check' THEN 0
    ELSE 1
  END
  LIMIT 1;

  IF rsvp_constraint_name IS NULL THEN
    RAISE EXCEPTION 'No RSVP state consistency constraint exists on public.invites';
  END IF;

  EXECUTE format(
    'ALTER TABLE public.invites VALIDATE CONSTRAINT %I',
    rsvp_constraint_name
  );
END
$$;

COMMIT;
