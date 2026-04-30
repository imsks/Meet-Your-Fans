
-- Drop the broad public SELECT policies
DROP POLICY "Anyone can view creators" ON public.creators;
DROP POLICY "Anyone can view audience members" ON public.audience_members;

-- Re-enable a restrictive read: only inserts allowed publicly; reads via views
-- (No SELECT policy = no rows readable directly via the table from anon)

-- Public-safe view of creators (no email)
CREATE VIEW public.creators_public
WITH (security_invoker = true) AS
SELECT id, name, social_type, social_handle, slug, created_at
FROM public.creators;

-- Public-safe view of audience pins (no email, no phone)
CREATE VIEW public.audience_public
WITH (security_invoker = true) AS
SELECT id, name, city, country, latitude, longitude, creator_id, created_at
FROM public.audience_members;

-- Allow anon/auth to read the views' underlying data via dedicated SELECT policies
-- on public-safe COLUMNS by re-adding SELECT but we'll instead grant via policies
-- that only return safe columns isn't possible — so we keep policies open for SELECT
-- on the views (security_invoker=true means the view runs with caller's privileges,
-- so we still need a SELECT policy on the base table). To limit exposure to
-- safe columns only, we keep INSERT-only at the table level and use
-- security_definer functions for reads.

-- Switch approach: drop the views and use security definer functions instead.
DROP VIEW public.creators_public;
DROP VIEW public.audience_public;

-- Function: list creators (safe fields)
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

-- Function: get one creator by slug (safe fields)
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

-- Function: get audience pins (safe fields only — no email/phone)
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

GRANT EXECUTE ON FUNCTION public.get_creators_public() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_creator_by_slug(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_audience_pins(UUID) TO anon, authenticated;
