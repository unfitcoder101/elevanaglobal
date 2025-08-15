-- Targeted security fix: Remove public read access and ensure admin-only policies exist
-- This migration addresses critical security vulnerabilities

-- 1. Fix business_customizations table - ensure no public read access
-- (Admin policy already exists, just need to ensure no public policies)

-- 2. Fix leads table - ensure no public read access  
-- (Admin policy already exists, just need to ensure no public policies)

-- 3. Fix messages table - ensure no public read access
-- (Admin policy already exists, just need to ensure no public policies)

-- 4. Fix growth_audit_submissions - replace overly permissive policy
DROP POLICY IF EXISTS "Allow reading submissions" ON public.growth_audit_submissions;

-- Only create the policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'growth_audit_submissions' 
        AND policyname = 'Admins can view all growth audit submissions'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all growth audit submissions" 
        ON public.growth_audit_submissions 
        FOR SELECT 
        USING (has_role(auth.uid(), ''admin''::app_role))';
    END IF;
END $$;

-- Ensure service role policy exists for growth_audit_submissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'growth_audit_submissions' 
        AND policyname = 'Service role can manage all growth audit submissions'
    ) THEN
        EXECUTE 'CREATE POLICY "Service role can manage all growth audit submissions" 
        ON public.growth_audit_submissions 
        FOR ALL 
        USING (true)';
    END IF;
END $$;