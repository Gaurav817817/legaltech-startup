-- ============================================================
-- MIGRATION 001 — Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add missing columns to lawyer_profiles
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS approved           BOOLEAN   DEFAULT false;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS practitioner_type  TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS firm_name          TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS years_experience   TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS bar_council_state  TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS phone              TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS courts             TEXT[];
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS work_mode          TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS availability       TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS cases_handled      TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS client_types       TEXT[];
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS notable_cases      TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS success_rate       TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS services           TEXT[];
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS fee_15min          TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS fee_30min          TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS fee_60min          TEXT;
ALTER TABLE public.lawyer_profiles ADD COLUMN IF NOT EXISTS other_practice_area TEXT;

-- 2. Approve the existing seed/demo lawyers
UPDATE public.lawyer_profiles SET approved = true WHERE approved IS NULL OR approved = false;

-- 3. RLS — let lawyers create and edit their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.lawyer_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.lawyer_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. RLS — let the admin approve/revoke any profile
CREATE POLICY "Admin can update any profile"
  ON public.lawyer_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND email = 'founders@amiquz.com'
    )
  );

-- 5. Indexes for common queries
CREATE INDEX IF NOT EXISTS lawyer_profiles_approved_idx   ON public.lawyer_profiles (approved);
CREATE INDEX IF NOT EXISTS lawyer_profiles_created_at_idx ON public.lawyer_profiles (created_at DESC);
