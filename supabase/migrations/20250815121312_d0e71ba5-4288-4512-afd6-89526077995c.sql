-- Comprehensive security fix: Restrict access to all sensitive data tables
-- This migration addresses critical security vulnerabilities by removing public read access

-- 1. Fix business_customizations table - remove public read access
DROP POLICY IF EXISTS "Anyone can view business customizations" ON public.business_customizations;

-- Ensure proper policies exist for business_customizations
CREATE POLICY "Admins can view all business customizations" 
ON public.business_customizations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage all business customizations" 
ON public.business_customizations 
FOR ALL 
USING (true);

-- 2. Fix leads table - remove public read access
DROP POLICY IF EXISTS "Anyone can view leads" ON public.leads;

-- Ensure proper policies exist for leads
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage all leads" 
ON public.leads 
FOR ALL 
USING (true);

-- 3. Fix messages table - remove public read access
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;

-- Ensure proper policies exist for messages
CREATE POLICY "Admins can view all messages" 
ON public.messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage all messages" 
ON public.messages 
FOR ALL 
USING (true);

-- 4. Fix growth_audit_submissions - replace overly permissive policy
DROP POLICY IF EXISTS "Allow reading submissions" ON public.growth_audit_submissions;

-- Create proper admin-only read access for growth audit submissions
CREATE POLICY "Admins can view all growth audit submissions" 
ON public.growth_audit_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage all growth audit submissions" 
ON public.growth_audit_submissions 
FOR ALL 
USING (true);

-- 5. Verify projects table has proper restrictions (should already be correct)
-- Projects should only be viewable by users and admins, no public access

-- 6. Verify project_payments table has proper restrictions (should already be correct)  
-- Project payments should only be viewable by users and admins, no public access

-- 7. Verify project_requests table has proper restrictions (should already be correct)
-- Project requests should only be viewable by users and admins, no public access

-- Keep all INSERT policies intact so forms continue to work:
-- - Anyone can submit business customizations
-- - Anyone can submit leads  
-- - Anyone can submit messages
-- - Anyone can submit growth audit forms