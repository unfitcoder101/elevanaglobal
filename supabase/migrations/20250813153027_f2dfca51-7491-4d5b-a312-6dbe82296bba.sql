-- Fix security vulnerability: Restrict business_customizations table access to admin users only
-- Currently anyone can read sensitive business customer data

-- Drop the existing overly permissive policy that allows anyone to read business customizations
DROP POLICY IF EXISTS "Allow reading business customizations" ON public.business_customizations;

-- Create a new restrictive policy that only allows admin users to read business customizations
CREATE POLICY "Admins can view all business customizations" 
ON public.business_customizations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add a policy for service role to manage business customizations (needed for admin operations)
CREATE POLICY "Service role can manage all business customizations" 
ON public.business_customizations 
FOR ALL 
USING (true);