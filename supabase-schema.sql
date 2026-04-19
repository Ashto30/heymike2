-- HeyMike Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client', -- 'admin' or 'client'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE public.brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  brand_guidelines JSONB DEFAULT '{}',
  brand_dna JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  platform TEXT DEFAULT 'meta', -- 'meta', 'linkedin', 'google', 'all'
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
  budget TEXT,
  start_date DATE,
  end_date DATE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content queue
CREATE TABLE public.content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'image', 'video', 'copy'
  title TEXT NOT NULL,
  description TEXT,
  content_url TEXT, -- URL to the generated content
  platform TEXT,
  format TEXT,
  style TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets library
CREATE TABLE public.assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'image', 'video'
  url TEXT NOT NULL,
  platform TEXT,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad accounts (connected platforms)
CREATE TABLE public.ad_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL, -- 'meta', 'google', 'linkedin'
  access_token TEXT, -- encrypted
  account_id TEXT,
  account_name TEXT,
  status TEXT DEFAULT 'disconnected', -- 'connected', 'disconnected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages (chat history)
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  sender TEXT DEFAULT 'user', -- 'user' or 'assistant'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Brands: users can only access their own brands
CREATE POLICY "Users can view own brands" ON public.brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brands" ON public.brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands" ON public.brands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands" ON public.brands
  FOR DELETE USING (auth.uid() = user_id);

-- Campaigns: users can only access their own campaigns
CREATE POLICY "Users can view own campaigns" ON public.campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own campaigns" ON public.campaigns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own campaigns" ON public.campaigns
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.brands 
      WHERE brands.id = campaigns.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Content: users can only access content from their campaigns
CREATE POLICY "Users can view own content" ON public.content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      JOIN public.brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = content.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own content" ON public.content
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      JOIN public.brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = content.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own content" ON public.content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      JOIN public.brands ON brands.id = campaigns.brand_id
      WHERE campaigns.id = content.campaign_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Assets: users can only access their own assets
CREATE POLICY "Users can view own assets" ON public.assets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets" ON public.assets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets" ON public.assets
  FOR DELETE USING (auth.uid() = user_id);

-- Ad accounts: users can only access their own accounts
CREATE POLICY "Users can view own ad accounts" ON public.ad_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ad accounts" ON public.ad_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ad accounts" ON public.ad_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ad accounts" ON public.ad_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Messages: users can only access their own messages
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON public.messages
  FOR DELETE USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage buckets for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Users can upload own assets" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() = owner AND bucket_id = 'assets');

CREATE POLICY "Users can view own assets" ON storage.objects
  FOR SELECT USING (auth.uid() = owner AND bucket_id = 'assets');

CREATE POLICY "Users can delete own assets" ON storage.objects
  FOR DELETE USING (auth.uid() = owner AND bucket_id = 'assets');

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() = owner AND bucket_id = 'avatars');