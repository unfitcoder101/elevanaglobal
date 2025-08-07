-- Add service and budget columns to messages table for unified inbox data
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS service text,
ADD COLUMN IF NOT EXISTS budget text;