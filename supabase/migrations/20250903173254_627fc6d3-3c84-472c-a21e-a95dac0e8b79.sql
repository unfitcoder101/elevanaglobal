-- Fix security issues by ensuring proper RLS policies

-- First, let's make sure RLS is enabled on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_audit_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Drop any potentially problematic policies and recreate them properly
DROP POLICY IF EXISTS "Anyone can submit leads form" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can manage all leads" ON public.leads;

DROP POLICY IF EXISTS "Anyone can submit business customization" ON public.business_customizations;
DROP POLICY IF EXISTS "Admins can view all business customizations" ON public.business_customizations;
DROP POLICY IF EXISTS "Service role can manage all business customizations" ON public.business_customizations;

DROP POLICY IF EXISTS "Admins can view all project requests" ON public.project_requests;
DROP POLICY IF EXISTS "Users can view their own project requests" ON public.project_requests;
DROP POLICY IF EXISTS "Users can update their own project request responses" ON public.project_requests;
DROP POLICY IF EXISTS "Service role can manage all project requests" ON public.project_requests;
DROP POLICY IF EXISTS "Admins can delete any project requests" ON public.project_requests;

DROP POLICY IF EXISTS "Anyone can submit messages" ON public.messages;
DROP POLICY IF EXISTS "Service role can manage all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON public.user_roles;

DROP POLICY IF EXISTS "Anyone can submit growth audit form" ON public.growth_audit_submissions;
DROP POLICY IF EXISTS "Admins can view all growth audit submissions" ON public.growth_audit_submissions;
DROP POLICY IF EXISTS "Service role can manage all growth audit submissions" ON public.growth_audit_submissions;

DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can view all contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Service role can manage all contact requests" ON public.contact_requests;

-- Now create secure policies for leads table
CREATE POLICY "Allow public lead submissions" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all leads" ON public.leads
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Secure policies for business_customizations table
CREATE POLICY "Allow public business customization submissions" ON public.business_customizations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all business customizations" ON public.business_customizations
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update business customizations" ON public.business_customizations
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete business customizations" ON public.business_customizations
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Secure policies for project_requests table  
CREATE POLICY "Users can view their own project requests" ON public.project_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all project requests" ON public.project_requests
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert project requests" ON public.project_requests
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own project request responses" ON public.project_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any project requests" ON public.project_requests
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project requests" ON public.project_requests
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Secure policies for messages table
CREATE POLICY "Allow public message submissions" ON public.messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all messages" ON public.messages
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update messages" ON public.messages
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete messages" ON public.messages
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Secure policies for user_roles table
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Secure policies for growth_audit_submissions table
CREATE POLICY "Allow public growth audit submissions" ON public.growth_audit_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all growth audit submissions" ON public.growth_audit_submissions
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update growth audit submissions" ON public.growth_audit_submissions
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete growth audit submissions" ON public.growth_audit_submissions
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Secure policies for contact_requests table
CREATE POLICY "Allow public contact request submissions" ON public.contact_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all contact requests" ON public.contact_requests
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact requests" ON public.contact_requests
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact requests" ON public.contact_requests
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));