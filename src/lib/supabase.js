import { createClient } from '@supabase/supabase-js';

// 이 값들은 브라우저 번들에 그대로 실려 공개됩니다. 공개용 키가 맞고,
// 실제 접근 제어는 Supabase의 RLS 정책이 담당합니다.
const SUPABASE_URL = 'https://kybfprvpgwqdrvrblxnq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ElxznaOSJEsTKOIbojNmlw_EaewKZTJ';

export const PHOTO_BUCKET = 'chabak-photos';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
});

export const photoUrl = (path) =>
  supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
