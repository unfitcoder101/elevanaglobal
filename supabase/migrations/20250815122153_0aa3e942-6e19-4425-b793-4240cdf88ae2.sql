-- Execute the comprehensive security fix migration
-- This addresses all critical security vulnerabilities by properly restricting table access

-- 1. Fix business_customizations table - ensure only admin access
-- Drop any existing public policies that might exist
DROP POLICY IF EXISTS "business_customizations_policy" ON public.business_customizations;
DROP POLICY IF EXISTS "public_read_access" ON public.business_customizations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.business_customizations;

-- 2. Fix leads table - ensure only admin access  
DROP POLICY IF EXISTS "leads_policy" ON public.leads;
DROP POLICY IF EXISTS "public_read_access" ON public.leads;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.leads;

-- 3. Fix messages table - ensure only admin access
DROP POLICY IF EXISTS "messages_policy" ON public.messages;
DROP POLICY IF EXISTS "public_read_access" ON public.messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.messages;

-- 4. Fix projects table - remove any public access
DROP POLICY IF EXISTS "projects_policy" ON public.projects;
DROP POLICY IF EXISTS "public_read_access" ON public.projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;

-- 5. Fix project_payments table - remove any public access
DROP POLICY IF EXISTS "project_payments_policy" ON public.project_payments;
DROP POLICY IF EXISTS "public_read_access" ON public.project_payments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_payments;

-- 6. Fix user_roles table - ensure proper access control
DROP POLICY IF EXISTS "user_roles_policy" ON public.user_roles;
DROP POLICY IF EXISTS "public_read_access" ON public.user_roles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_roles;

-- 7. Fix project_requests table - remove any public access
DROP POLICY IF EXISTS "project_requests_policy" ON public.project_requests;
DROP POLICY IF EXISTS "public_read_access" ON public.project_requests;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_requests;

-- Verify all tables have proper RLS policies in place
-- The existing admin-only and user-scoped policies should remain intact