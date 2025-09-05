-- Allow users to insert projects when accepting project requests
-- This is needed so users can accept project requests sent by admins

CREATE POLICY "Users can insert projects when accepting requests"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);