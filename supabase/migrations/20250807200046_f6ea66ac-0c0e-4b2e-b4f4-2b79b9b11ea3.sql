-- RLS enhancements for admin and payments flow

-- Allow admins to view and update all projects
CREATE POLICY "Admins can view all projects"
ON public.projects
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update any projects"
ON public.projects
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Project payments: allow admin to manage and users to update their own
CREATE POLICY "Admins can view all project payments"
ON public.project_payments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert project payments"
ON public.project_payments
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update any project payments"
ON public.project_payments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own project payments"
ON public.project_payments
FOR UPDATE
USING (auth.uid() = user_id);

-- Project requests: allow admins to view and delete any
CREATE POLICY "Admins can view all project requests"
ON public.project_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete any project requests"
ON public.project_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));