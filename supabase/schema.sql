-- ============================================
-- RVR COLORIDO 2K26 — Supabase Database Setup
-- ============================================
-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor)
-- This creates all tables, relationships, and Row Level Security policies.

-- ============================================
-- 1. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('cultural', 'sports')),
  subcategory TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'open' CHECK (gender IN ('boys', 'girls', 'mixed', 'open')),
  description TEXT DEFAULT '',
  rules JSONB DEFAULT '[]'::jsonb,
  venue TEXT DEFAULT '',
  event_date DATE,
  start_time TEXT DEFAULT '',
  end_time TEXT DEFAULT '',
  max_participants INTEGER DEFAULT 0,
  registration_open BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  course TEXT DEFAULT '',
  year TEXT DEFAULT '',
  gender TEXT NOT NULL,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_name TEXT,
  participant_count INTEGER DEFAULT 1,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 1,
  participant_name TEXT NOT NULL,
  team_name TEXT,
  college TEXT NOT NULL,
  score TEXT,
  remarks TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. SPONSORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  sponsorship_level TEXT NOT NULL DEFAULT 'supporting' CHECK (sponsorship_level IN ('title', 'gold', 'silver', 'supporting')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. PROFILES TABLE (for admin users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'organizer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- EVENTS: Public can read, authenticated users can manage
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can insert events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update events" ON events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete events" ON events FOR DELETE TO authenticated USING (true);

-- REGISTRATIONS: Public can insert, authenticated users can read/update
CREATE POLICY "Anyone can create registration" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read registrations" ON registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update registrations" ON registrations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete registrations" ON registrations FOR DELETE TO authenticated USING (true);

-- ANNOUNCEMENTS: Public can read published, authenticated can manage
CREATE POLICY "Public can read published announcements" ON announcements FOR SELECT USING (published = true OR (SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "Admins can insert announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update announcements" ON announcements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete announcements" ON announcements FOR DELETE TO authenticated USING (true);

-- RESULTS: Public can read published, authenticated can manage
CREATE POLICY "Public can read published results" ON results FOR SELECT USING (published = true OR (SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "Admins can insert results" ON results FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update results" ON results FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete results" ON results FOR DELETE TO authenticated USING (true);

-- GALLERY: Public can read, authenticated can manage
CREATE POLICY "Public can read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can delete gallery" ON gallery FOR DELETE TO authenticated USING (true);

-- SPONSORS: Public can read, authenticated can manage
CREATE POLICY "Public can read sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Admins can insert sponsors" ON sponsors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update sponsors" ON sponsors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete sponsors" ON sponsors FOR DELETE TO authenticated USING (true);

-- PROFILES: Only own profile visible
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (id = (SELECT auth.uid()));

-- ============================================
-- 9. STORAGE BUCKET FOR GALLERY
-- ============================================
-- Note: Create a storage bucket named 'colorido' in Supabase Dashboard
-- Dashboard > Storage > New Bucket > Name: colorido > Public: ON

-- ============================================
-- 10. AUTO-UPDATE TRIGGER FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PARTICIPATING COLLEGES TABLE
CREATE TABLE IF NOT EXISTS participating_colleges (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT NOT NULL, short_name TEXT, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE IF NOT EXISTS colleges (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT NOT NULL, short_name TEXT, code TEXT, is_participating BOOLEAN DEFAULT true, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());

ALTER TABLE participating_colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read participating_colleges" ON participating_colleges FOR SELECT USING (true);
CREATE POLICY "Admins can manage participating_colleges" ON participating_colleges FOR ALL TO authenticated USING (true);

ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read colleges" ON colleges FOR SELECT USING (true);
CREATE POLICY "Admins can manage colleges" ON colleges FOR ALL TO authenticated USING (true);
