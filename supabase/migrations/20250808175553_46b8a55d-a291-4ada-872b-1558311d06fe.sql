-- Add call_time field to leads table
ALTER TABLE public.leads 
ADD COLUMN call_time time;

-- Add call_time field to business_customizations table
ALTER TABLE public.business_customizations 
ADD COLUMN call_time time;

-- Add call_time field to messages table
ALTER TABLE public.messages 
ADD COLUMN call_time time;

-- Add call_time field to contact_requests table
ALTER TABLE public.contact_requests 
ADD COLUMN call_time time;

-- Add call_time field to growth_audit_submissions table
ALTER TABLE public.growth_audit_submissions 
ADD COLUMN call_time time;