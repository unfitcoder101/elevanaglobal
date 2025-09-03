-- Add spam protection to public forms while maintaining functionality

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