-- Create storage buckets for FitWith

-- Exercises bucket (videos and thumbnails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercises', 'exercises', true)
ON CONFLICT (id) DO NOTHING;

-- Transformations bucket (before/after photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('transformations', 'transformations', true)
ON CONFLICT (id) DO NOTHING;

-- Blog bucket (cover images and article media)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket (user profile pictures)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for exercises
CREATE POLICY "Public can view exercises media"
ON storage.objects FOR SELECT
USING (bucket_id = 'exercises');

CREATE POLICY "Admins can upload exercises media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'exercises' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update exercises media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'exercises' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete exercises media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'exercises' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Storage policies for transformations
CREATE POLICY "Public can view transformations"
ON storage.objects FOR SELECT
USING (bucket_id = 'transformations');

CREATE POLICY "Admins can upload transformations"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'transformations' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update transformations"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'transformations' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete transformations"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'transformations' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Storage policies for blog
CREATE POLICY "Public can view blog media"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

CREATE POLICY "Admins can upload blog media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update blog media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete blog media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Storage policies for avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can manage all avatars"
ON storage.objects FOR ALL
USING (
  bucket_id = 'avatars' AND
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);
