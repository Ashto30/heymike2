-- Add polled column to track which messages have been polled
ALTER TABLE public.demo_messages ADD COLUMN IF NOT EXISTS polled BOOLEAN DEFAULT FALSE;

-- Create index for faster polling
CREATE INDEX IF NOT EXISTS idx_demo_messages_polled 
ON public.demo_messages(polled) 
WHERE polled = FALSE;