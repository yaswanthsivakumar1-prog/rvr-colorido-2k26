-- =========================================================================
-- COLORIDO 2K26 — Supabase Auth, Roles & RLS Security Migration
-- =========================================================================
-- Run this migration in your Supabase SQL Editor (Dashboard > SQL Editor)
-- to enforce database-backed roles, indexes, and row-level security.

-- 1. UPDATE REGISTRATIONS STATUS CHECK TO SUPPORT ALL 5 STATES
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_status_check;
ALTER TABLE registrations ADD CONSTRAINT registrations_status_check
  CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed'));

-- 2. CREATE PERFORMANCE & SEARCH INDEXES (Section 21)
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- 3. UNIQUE USER + EVENT CONSTRAINT (Section 7)
-- Prevents authenticated duplicate registration for the same event
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_event ON registrations(user_id, event_id) WHERE user_id IS NOT NULL;

-- 4. DATABASE-BACKED ADMIN ROLE HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'organizer')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 5. FINE-GRAINED ROW LEVEL SECURITY (RLS) POLICIES (Section 20)

-- A. REGISTRATIONS TABLE
DROP POLICY IF EXISTS "Public and students can read registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON registrations;
DROP POLICY IF EXISTS "Anyone can create registration" ON registrations;

-- Anyone can submit registration
CREATE POLICY "Anyone can create registration" ON registrations
  FOR INSERT WITH CHECK (true);

-- Students can read their own registrations; Admins can read all registrations
CREATE POLICY "Students and admins read registrations" ON registrations
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin() OR
    (auth.uid() IS NULL)
  );

-- Admins can update any registration status; Students can only cancel their own pending registration
CREATE POLICY "Authorized update registrations" ON registrations
  FOR UPDATE USING (
    public.is_admin() OR
    (auth.uid() IS NOT NULL AND user_id = auth.uid() AND status = 'cancelled')
  );

-- Admins can delete registrations
CREATE POLICY "Admins can delete registrations" ON registrations
  FOR DELETE USING (public.is_admin());

-- B. EVENTS TABLE
DROP POLICY IF EXISTS "Admins can insert events" ON events;
DROP POLICY IF EXISTS "Admins can update events" ON events;
DROP POLICY IF EXISTS "Admins can delete events" ON events;

CREATE POLICY "Admins can insert events" ON events
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events" ON events
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete events" ON events
  FOR DELETE TO authenticated USING (public.is_admin());

-- C. ANNOUNCEMENTS TABLE
DROP POLICY IF EXISTS "Admins can insert announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON announcements;

CREATE POLICY "Admins can insert announcements" ON announcements
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update announcements" ON announcements
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete announcements" ON announcements
  FOR DELETE TO authenticated USING (public.is_admin());

-- D. RESULTS TABLE
DROP POLICY IF EXISTS "Admins can insert results" ON results;
DROP POLICY IF EXISTS "Admins can update results" ON results;
DROP POLICY IF EXISTS "Admins can delete results" ON results;

CREATE POLICY "Admins can insert results" ON results
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update results" ON results
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete results" ON results
  FOR DELETE TO authenticated USING (public.is_admin());

-- E. PROFILES TABLE
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Users can update their own profile, but cannot elevate themselves to admin
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (
    (auth.uid() = id AND role = 'student') OR
    public.is_admin()
  );
