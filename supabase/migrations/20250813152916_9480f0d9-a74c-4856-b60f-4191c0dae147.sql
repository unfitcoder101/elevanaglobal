-- Fix security vulnerability: Restrict leads table access to admin users only
-- Currently anyone can read sensitive customer data from the leads table

-- Drop the existing overly permissive policy that allows anyone to read leads
DROP POLICY IF EXISTS "Allow reading leads" ON public.leads;

-- Create a new restrictive policy that only allows admin users to read leads
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also add a policy for service role to manage leads (needed for admin operations)
CREATE POLICY "Service role can manage all leads" 
ON public.leads 
FOR ALL 
USING (true);