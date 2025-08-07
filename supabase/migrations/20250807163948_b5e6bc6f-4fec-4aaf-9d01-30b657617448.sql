-- Add admin role to kanhayadav1610@gmail.com user
-- Create user_roles table for role management
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all roles"
ON public.user_roles
FOR ALL
USING (true);

-- Add growth_audit_submissions table for tracking free audit requests
-- This table already exists, but let's add more fields for better tracking
ALTER TABLE public.growth_audit_submissions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMP WITH TIME ZONE;

-- Add leads table for contact form submissions 
-- This table already exists, so we'll just add a status field if it doesn't exist
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMP WITH TIME ZONE;

-- Create contact_requests table for schedule call requests
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    request_type TEXT NOT NULL DEFAULT 'call_request', -- 'call_request', 'quote_request', 'custom_plan'
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    contacted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_requests
CREATE POLICY "Anyone can submit contact requests"
ON public.contact_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow reading contact requests"
ON public.contact_requests
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();