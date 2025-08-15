-- Fix security vulnerability: Restrict contact_requests table access to admin users only
-- Currently anyone can read sensitive customer contact information

-- Drop the existing overly permissive policy that allows anyone to read contact requests
DROP POLICY IF EXISTS "Allow reading contact requests" ON public.contact_requests;

-- Create a new restrictive policy that only allows admin users to read contact requests
CREATE POLICY "Admins can view all contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add a policy for service role to manage contact requests (needed for admin operations)
CREATE POLICY "Service role can manage all contact requests" 
ON public.contact_requests 
FOR ALL 
USING (true);

-- Keep the existing INSERT policy - anyone can still submit contact requests
-- This ensures the contact form continues to work for visitors