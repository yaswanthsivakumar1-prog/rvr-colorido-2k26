-- =========================================================================
-- COLORIDO 2K26 — Add Missing user_id Column to Registrations Table
-- =========================================================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations(user_id);
