-- Fix the function search path security warning
CREATE OR REPLACE FUNCTION public.validate_form_submission()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;