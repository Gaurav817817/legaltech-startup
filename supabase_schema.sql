-- 1. Create Lawyer Profiles Table
CREATE TABLE public.lawyer_profiles (
  id UUID PRIMARY KEY, -- In production, this references auth.users(id)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT,
  practice_areas TEXT[],
  location TEXT,
  rating NUMERIC DEFAULT 0,
  reviews INT DEFAULT 0,
  image_url TEXT,
  about TEXT,
  education TEXT[],
  languages TEXT[],
  consultation_fee TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to lawyer profiles so anyone can search
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.lawyer_profiles FOR SELECT
  USING ( true );

-- 2. Create Consultations (Bookings) Table
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID, -- References auth.users(id)
  lawyer_id UUID REFERENCES public.lawyer_profiles(id),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  amount INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Insert Mock Seed Data for Testing
INSERT INTO public.lawyer_profiles 
(id, first_name, last_name, title, practice_areas, location, rating, reviews, image_url, about, education, languages, consultation_fee)
VALUES 
(gen_random_uuid(), 'Sarah J.', 'Adams', 'Managing Partner at Adams & Associates', ARRAY['Corporate Law', 'Family Law', 'Startups'], 'New York, NY', 4.9, 120, 'https://i.pravatar.cc/300?u=a042581f4e29026024d', 'Sarah J. Adams is a highly respected attorney guiding startups through complex legal landscapes.', ARRAY['J.D., Harvard Law School', 'B.A., Stanford University'], ARRAY['English', 'Spanish'], '$200 / hr'),
(gen_random_uuid(), 'David', 'Chen', 'Intellectual Property Specialist', ARRAY['Intellectual Property', 'Tech Law', 'Corporate Law'], 'San Francisco, CA', 4.8, 85, 'https://i.pravatar.cc/150?u=a042581f4e29026704d', 'David is an expert in patent law, trademark registration, and tech startup advisory.', ARRAY['J.D., Stanford Law', 'B.S. Computer Science, MIT'], ARRAY['English', 'Mandarin'], '$250 / hr'),
(gen_random_uuid(), 'Elena', 'Rodriguez', 'Senior Family Law Partner', ARRAY['Family Law', 'Divorce'], 'Miami, FL', 4.9, 210, 'https://i.pravatar.cc/150?u=a04258a2462d826712d', 'Compassionate representation for family disputes and divorce proceedings.', ARRAY['J.D., University of Miami'], ARRAY['English', 'Spanish'], '$150 / hr'),
(gen_random_uuid(), 'Michael', 'Barnes', 'Defense Attorney', ARRAY['Criminal Defense', 'DUI'], 'Chicago, IL', 4.7, 156, 'https://i.pravatar.cc/150?u=a042581f4e29026703d', 'Aggressive defense attorney with 20 years of courtroom experience.', ARRAY['J.D., Northwestern University'], ARRAY['English'], '$180 / hr');
