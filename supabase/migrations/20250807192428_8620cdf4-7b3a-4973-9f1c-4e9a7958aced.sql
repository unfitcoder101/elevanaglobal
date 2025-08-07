-- Add admin-only SELECT policy for messages so Admin Dashboard can read them
create policy if not exists "Admins can view all messages"
  on public.messages
  for select
  using (has_role(auth.uid(), 'admin'::app_role));