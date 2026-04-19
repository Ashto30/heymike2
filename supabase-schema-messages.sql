-- HeyMike Demo Messages Table (no RLS for easy testing)
-- This is a simplified version for demo purposes

CREATE TABLE IF NOT EXISTS public.demo_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sender TEXT DEFAULT 'user', -- 'user' or 'assistant'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

-- Create index for faster polling
CREATE INDEX IF NOT EXISTS idx_demo_messages_unprocessed 
ON public.demo_messages(created_at) 
WHERE processed = FALSE;

-- Allow all access (demo table)
ALTER TABLE public.demo_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON public.demo_messages;
CREATE POLICY "Allow all access" ON public.demo_messages FOR ALL USING (true) WITH CHECK (true);