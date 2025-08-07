-- Update existing pending projects to in_progress status
UPDATE public.projects 
SET status = 'in_progress', updated_at = now()
WHERE status = 'pending';