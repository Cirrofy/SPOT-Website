
-- Set search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Revoke EXECUTE on SECURITY DEFINER functions from public/authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Restrict avatar SELECT so users can only view files in their own folder OR via direct public URL
-- (public bucket still serves files via public URL; this just blocks listing)
DROP POLICY "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Users can view own avatar files" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
