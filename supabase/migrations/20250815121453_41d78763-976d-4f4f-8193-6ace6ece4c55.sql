-- Fix all remaining security vulnerabilities by properly restricting table access
-- This migration addresses all remaining critical security issues

-- 1. Fix business_customizations table - ensure only admin access
-- Drop any existing public policies that might exist
DROP POLICY IF EXISTS "business_customizations_policy" ON public.business_customizations;
DROP POLICY IF EXISTS "public_read_access" ON public.business_customizations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.business_customizations;

-- Ensure admin-only SELECT policy exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'business_customizations' 
        AND policyname = 'Admins can view all business customizations'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all business customizations" 
        ON public.business_customizations 
        FOR SELECT 
        USING (has_role(auth.uid(), ''admin''::app_role))';
    END IF;
END $$;

-- 2. Fix leads table - ensure only admin access
-- Drop any existing public policies
DROP POLICY IF EXISTS "leads_policy" ON public.leads;
DROP POLICY IF EXISTS "public_read_access" ON public.leads;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.leads;

-- Ensure admin-only SELECT policy exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leads' 
        AND policyname = 'Admins can view all leads'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all leads" 
        ON public.leads 
        FOR SELECT 
        USING (has_role(auth.uid(), ''admin''::app_role))';
    END IF;
END $$;

-- 3. Fix messages table - ensure only admin access
-- Drop any existing public policies
DROP POLICY IF EXISTS "messages_policy" ON public.messages;
DROP POLICY IF EXISTS "public_read_access" ON public.messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.messages;

-- Ensure admin-only SELECT policy exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'messages' 
        AND policyname = 'Admins can view all messages'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all messages" 
        ON public.messages 
        FOR SELECT 
        USING (has_role(auth.uid(), ''admin''::app_role))';
    END IF;
END $$;

-- 4. Fix projects table - remove any public access
-- Drop any existing public policies
DROP POLICY IF EXISTS "projects_policy" ON public.projects;
DROP POLICY IF EXISTS "public_read_access" ON public.projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;

-- Projects should only be accessible by users and admins (existing policies should handle this)

-- 5. Fix project_payments table - remove any public access
-- Drop any existing public policies
DROP POLICY IF EXISTS "project_payments_policy" ON public.project_payments;
DROP POLICY IF EXISTS "public_read_access" ON public.project_payments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_payments;

-- Project payments should only be accessible by users and admins (existing policies should handle this)

-- 6. Fix user_roles table - ensure proper access control
-- Drop any existing public policies
DROP POLICY IF EXISTS "user_roles_policy" ON public.user_roles;
DROP POLICY IF EXISTS "public_read_access" ON public.user_roles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_roles;

-- User roles should only be viewable by the user themselves (existing policy should handle this)

-- 7. Fix project_requests table - remove any public access
-- Drop any existing public policies
DROP POLICY IF EXISTS "project_requests_policy" ON public.project_requests;
DROP POLICY IF EXISTS "public_read_access" ON public.project_requests;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_requests;

-- Project requests should only be accessible by users and admins (existing policies should handle this)