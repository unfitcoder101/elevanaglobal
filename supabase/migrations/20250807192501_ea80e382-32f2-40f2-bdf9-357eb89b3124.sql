-- Add admin-only SELECT policy for messages so Admin Dashboard can read them
CREATE POLICY "Admins can view all messages"
  ON public.messages
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));