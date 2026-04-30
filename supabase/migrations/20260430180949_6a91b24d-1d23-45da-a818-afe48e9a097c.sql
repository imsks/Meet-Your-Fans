
-- Creators table
CREATE TABLE public.creators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  social_type TEXT NOT NULL CHECK (social_type IN ('linkedin','instagram','twitter','youtube','other')),
  social_handle TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_creators_slug ON public.creators(slug);

-- Audience members table
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

CREATE INDEX idx_audience_creator ON public.audience_members(creator_id);

-- Enable RLS
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_members ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view creators" ON public.creators FOR SELECT USING (true);
CREATE POLICY "Anyone can view audience members" ON public.audience_members FOR SELECT USING (true);

-- Public insert (open registration)
CREATE POLICY "Anyone can register as creator" ON public.creators FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can register as audience" ON public.audience_members FOR INSERT WITH CHECK (true);
