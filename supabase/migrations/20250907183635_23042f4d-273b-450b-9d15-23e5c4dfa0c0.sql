-- Add admin confirmation field to project_payments table
ALTER TABLE public.project_payments 
ADD COLUMN admin_confirmed BOOLEAN DEFAULT FALSE;

-- Add admin confirmation timestamp
ALTER TABLE public.project_payments 
ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE;