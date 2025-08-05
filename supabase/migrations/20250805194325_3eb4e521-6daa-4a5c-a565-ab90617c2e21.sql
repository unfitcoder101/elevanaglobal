-- Create a table for growth audit form submissions
CREATE TABLE public.growth_audit_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website_instagram TEXT,
  biggest_challenge TEXT NOT NULL,
  desired_results TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.growth_audit_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for lead generation)
CREATE POLICY "Anyone can submit growth audit form" 
ON public.growth_audit_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading (for admin purposes later)
CREATE POLICY "Allow reading submissions" 
ON public.growth_audit_submissions 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_growth_audit_submissions_updated_at
BEFORE UPDATE ON public.growth_audit_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();