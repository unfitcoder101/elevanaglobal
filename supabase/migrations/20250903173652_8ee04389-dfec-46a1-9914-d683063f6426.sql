-- Add spam protection to public forms while maintaining functionality

-- First, let's add some rate limiting and validation to the tables
-- Add a honeypot field and IP tracking capabilities for spam detection

-- Add spam protection fields to contact_requests
ALTER TABLE public.contact_requests 
ADD COLUMN IF NOT EXISTS honeypot_field TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS submission_ip INET DEFAULT NULL,
ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT NULL;

-- Add spam protection fields to leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS honeypot_field TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS submission_ip INET DEFAULT NULL,
ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT NULL;

-- Add spam protection fields to messages
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS honeypot_field TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS submission_ip INET DEFAULT NULL,
ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT NULL;

-- Add spam protection fields to business_customizations
ALTER TABLE public.business_customizations 
ADD COLUMN IF NOT EXISTS honeypot_field TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS submission_ip INET DEFAULT NULL,
ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT NULL;

-- Add spam protection fields to growth_audit_submissions
ALTER TABLE public.growth_audit_submissions 
ADD COLUMN IF NOT EXISTS honeypot_field TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS submission_ip INET DEFAULT NULL,
ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT NULL;

-- Create a function to validate form submissions
CREATE OR REPLACE FUNCTION public.validate_form_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for honeypot field (should be empty for legitimate users)
  IF NEW.honeypot_field IS NOT NULL AND NEW.honeypot_field != '' THEN
    RAISE EXCEPTION 'Spam detected: honeypot field filled';
  END IF;
  
  -- Basic email validation
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Ensure required fields are not empty
  IF NEW.name IS NULL OR trim(NEW.name) = '' THEN
    RAISE EXCEPTION 'Name is required';
  END IF;
  
  IF NEW.email IS NULL OR trim(NEW.email) = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  
  -- Check for minimum name length (prevents single character spam)
  IF length(trim(NEW.name)) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation triggers to all public form tables
CREATE TRIGGER validate_contact_request_submission
  BEFORE INSERT ON public.contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_form_submission();

CREATE TRIGGER validate_lead_submission
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_form_submission();

CREATE TRIGGER validate_message_submission
  BEFORE INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_form_submission();

CREATE TRIGGER validate_business_customization_submission
  BEFORE INSERT ON public.business_customizations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_form_submission();

CREATE TRIGGER validate_growth_audit_submission
  BEFORE INSERT ON public.growth_audit_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_form_submission();

-- Create a view for admins to monitor suspicious submissions
CREATE OR REPLACE VIEW public.admin_suspicious_submissions AS
SELECT 
  'contact_requests' as table_name,
  id,
  name,
  email,
  created_at,
  submission_ip,
  CASE 
    WHEN honeypot_field IS NOT NULL AND honeypot_field != '' THEN 'Honeypot filled'
    WHEN submission_ip IN (
      SELECT submission_ip 
      FROM public.contact_requests 
      WHERE submission_ip IS NOT NULL 
      GROUP BY submission_ip 
      HAVING COUNT(*) > 5
    ) THEN 'Multiple submissions from same IP'
    ELSE 'Clean'
  END as risk_level
FROM public.contact_requests
WHERE created_at > now() - interval '24 hours'

UNION ALL

SELECT 
  'leads' as table_name,
  id,
  name,
  email,
  created_at,
  submission_ip,
  CASE 
    WHEN honeypot_field IS NOT NULL AND honeypot_field != '' THEN 'Honeypot filled'
    WHEN submission_ip IN (
      SELECT submission_ip 
      FROM public.leads 
      WHERE submission_ip IS NOT NULL 
      GROUP BY submission_ip 
      HAVING COUNT(*) > 5
    ) THEN 'Multiple submissions from same IP'
    ELSE 'Clean'
  END as risk_level
FROM public.leads
WHERE created_at > now() - interval '24 hours'

UNION ALL

SELECT 
  'messages' as table_name,
  id,
  name,
  email,
  created_at,
  submission_ip,
  CASE 
    WHEN honeypot_field IS NOT NULL AND honeypot_field != '' THEN 'Honeypot filled'
    WHEN submission_ip IN (
      SELECT submission_ip 
      FROM public.messages 
      WHERE submission_ip IS NOT NULL 
      GROUP BY submission_ip 
      HAVING COUNT(*) > 5
    ) THEN 'Multiple submissions from same IP'
    ELSE 'Clean'
  END as risk_level
FROM public.messages
WHERE created_at > now() - interval '24 hours';

-- Grant admins access to the suspicious submissions view
GRANT SELECT ON public.admin_suspicious_submissions TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Admins can view suspicious submissions" ON public.admin_suspicious_submissions
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));