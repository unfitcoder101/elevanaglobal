-- Additional security fixes for remaining tables

-- Ensure RLS is enabled on all remaining tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_requests ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Secure policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Drop and recreate policies for payments table
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can delete any payments" ON public.payments;

-- Secure policies for payments table
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Drop and recreate policies for project_payments table
DROP POLICY IF EXISTS "Users can view their own project payments" ON public.project_payments;
DROP POLICY IF EXISTS "Service role can manage all project payments" ON public.project_payments;
DROP POLICY IF EXISTS "Admins can delete any project payments" ON public.project_payments;
DROP POLICY IF EXISTS "Admins can view all project payments" ON public.project_payments;
DROP POLICY IF EXISTS "Admins can insert project payments" ON public.project_payments;
DROP POLICY IF EXISTS "Admins can update any project payments" ON public.project_payments;
DROP POLICY IF EXISTS "Users can update their own project payments" ON public.project_payments;

-- Secure policies for project_payments table
CREATE POLICY "Users can view their own project payments" ON public.project_payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all project payments" ON public.project_payments
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage project payments" ON public.project_payments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Drop and recreate policies for projects table
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can manage all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete any projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update any projects" ON public.projects;

-- Secure policies for projects table
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Drop and recreate policies for user_requests table
DROP POLICY IF EXISTS "Users can view their own requests" ON public.user_requests;
DROP POLICY IF EXISTS "Users can create requests" ON public.user_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON public.user_requests;

-- Secure policies for user_requests table
CREATE POLICY "Users can view their own requests" ON public.user_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" ON public.user_requests
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create requests" ON public.user_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" ON public.user_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage requests" ON public.user_requests
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));