-- Add missing phone column to business_customizations table
ALTER TABLE public.business_customizations 
ADD COLUMN IF NOT EXISTS phone text;

-- Create projects table for admin project management
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  project_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  hours_worked integer DEFAULT 0,
  estimated_hours integer,
  estimated_cost numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  completion_percentage integer DEFAULT 0
);

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can do everything (we'll create admin role system later)
CREATE POLICY "Service role can manage all projects" ON public.projects
  FOR ALL USING (true);

-- Create project_payments table to track payments per project
CREATE TABLE IF NOT EXISTS public.project_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  description text,
  due_date timestamp with time zone,
  paid_at timestamp with time zone,
  payment_method text,
  transaction_id text,
  reference_number text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on project_payments table
ALTER TABLE public.project_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for project_payments table
CREATE POLICY "Users can view their own project payments" ON public.project_payments
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all project payments
CREATE POLICY "Service role can manage all project payments" ON public.project_payments
  FOR ALL USING (true);

-- Fix storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add trigger for updating updated_at column on projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updating updated_at column on project_payments table
CREATE TRIGGER update_project_payments_updated_at
  BEFORE UPDATE ON public.project_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();