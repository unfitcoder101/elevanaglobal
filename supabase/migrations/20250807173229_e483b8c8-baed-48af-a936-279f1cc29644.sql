-- Create a project_requests table for admin-initiated project requests that users can accept/decline
CREATE TABLE public.project_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  project_type text NOT NULL,
  estimated_hours integer,
  estimated_cost numeric,
  status text NOT NULL DEFAULT 'pending', -- pending, accepted, declined
  admin_notes text,
  user_response_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  responded_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own project requests" 
ON public.project_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own project request responses" 
ON public.project_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all project requests" 
ON public.project_requests 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_requests_updated_at
BEFORE UPDATE ON public.project_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();