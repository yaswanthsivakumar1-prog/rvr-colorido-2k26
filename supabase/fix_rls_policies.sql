-- =========================================================================
-- COLORIDO 2K26 — FIX ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
-- Run this script in your Supabase Dashboard -> SQL Editor -> Click RUN
-- This allows:
-- 1. Anyone/Students to submit event registrations into the database
-- 2. Anyone/Students to view their registration passes and dashboard
-- 3. Student accounts and profiles to be saved and updated
-- =========================================================================

-- 1. FIX REGISTRATIONS TABLE POLICIES
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create registration" ON public.registrations;
DROP POLICY IF EXISTS "Public can read registrations" ON public.registrations;
DROP POLICY IF EXISTS "Students and admins read registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public and students can read registrations" ON public.registrations;
DROP POLICY IF EXISTS "Authorized update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON public.registrations;

-- Allow anyone (public and logged-in students) to insert event registrations
CREATE POLICY "Anyone can create registration"
  ON public.registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public and students to view registrations (for pass lookup and dashboard)
CREATE POLICY "Public can read registrations"
  ON public.registrations
  FOR SELECT
  TO public
  USING (true);

-- Allow updating registrations
CREATE POLICY "Anyone can update registrations"
  ON public.registrations
  FOR UPDATE
  TO public
  USING (true);

-- Allow deleting registrations
CREATE POLICY "Anyone can delete registrations"
  ON public.registrations
  FOR DELETE
  TO public
  USING (true);


-- 2. FIX PROFILES TABLE POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Allow reading profiles
CREATE POLICY "Public can read profiles"
  ON public.profiles
  FOR SELECT
  TO public
  USING (true);

-- Allow inserting profiles during student registration/signup
CREATE POLICY "Anyone can insert profiles"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow updating profiles
CREATE POLICY "Anyone can update profiles"
  ON public.profiles
  FOR UPDATE
  TO public
  USING (true);


-- 3. FIX EVENTS TABLE POLICIES (Ensure public read is always active)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read events" ON public.events;
CREATE POLICY "Public can read events"
  ON public.events
  FOR SELECT
  TO public
  USING (true);

-- =========================================================================
-- SUCCESS! Registrations and student profiles can now be saved into Supabase!
-- =========================================================================
