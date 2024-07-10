import { createClient } from '@supabase/supabase-js';

const bucket = 'home-away';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  // const newName = `/users/${timestamp}-${image.name}`; usersフォルダを作ってその中に入れた場合
  const newName = `${timestamp}-${image.name}`;
  // Fileクラスのオブジェクトは、name, size, type, lastModified等のプロパティを有する

  const { data } = await supabase.storage.from(bucket).upload(newName, image, {
    cacheControl: '3600',
  });
  if (!data) throw new Error('Image upload failed');
  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};
