-- ============================================================
-- MeetYourFans — Complete Database Schema
-- ============================================================
-- Paste this into the Supabase SQL Editor and run it.
-- It creates all tables, indexes, RLS policies, and functions.
-- ============================================================

-- 1. Tables
-- ----------------------------------------------------------

CREATE TABLE public.creators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  social_type TEXT NOT NULL CHECK (social_type IN ('linkedin','instagram','twitter','youtube','other')),
  social_handle TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.audience_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT,
  city TEXT NOT NULL,
  country TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  creator_id UUID REFERENCES public.creators(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes
-- ----------------------------------------------------------

CREATE INDEX idx_creators_slug ON public.creators(slug);
CREATE INDEX idx_audience_creator ON public.audience_members(creator_id);

-- 3. Row Level Security
-- ----------------------------------------------------------

ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_members ENABLE ROW LEVEL SECURITY;

-- Open insert (anyone can register)
CREATE POLICY "Anyone can register as creator"
  ON public.creators FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can register as audience"
  ON public.audience_members FOR INSERT WITH CHECK (true);

-- No direct SELECT policies — reads go through security definer functions below.

-- 4. Security Definer Functions (public API)
-- ----------------------------------------------------------

-- List all creators with audience count (no email exposed)
CREATE OR REPLACE FUNCTION public.get_creators_public()
RETURNS TABLE (
  id UUID,
  name TEXT,
  social_type TEXT,
  social_handle TEXT,
  slug TEXT,
  created_at TIMESTAMPTZ,
  audience_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.name, c.social_type, c.social_handle, c.slug, c.created_at,
         (SELECT COUNT(*) FROM public.audience_members a WHERE a.creator_id = c.id) AS audience_count
  FROM public.creators c
  ORDER BY c.created_at DESC;
$$;

-- Get a single creator by slug (no email exposed)
CREATE OR REPLACE FUNCTION public.get_creator_by_slug(_slug TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  social_type TEXT,
  social_handle TEXT,
  slug TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.name, c.social_type, c.social_handle, c.slug, c.created_at
  FROM public.creators c
  WHERE c.slug = _slug
  LIMIT 1;
$$;

-- Get audience pins for a creator (no email/phone exposed)
CREATE OR REPLACE FUNCTION public.get_audience_pins(_creator_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  city TEXT,
  country TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  creator_id UUID,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id, a.name, a.city, a.country, a.latitude, a.longitude, a.creator_id, a.created_at
  FROM public.audience_members a
  WHERE (_creator_id IS NULL OR a.creator_id = _creator_id);
$$;

-- 5. Grants
-- ----------------------------------------------------------

GRANT EXECUTE ON FUNCTION public.get_creators_public() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_creator_by_slug(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_audience_pins(UUID) TO anon, authenticated;
