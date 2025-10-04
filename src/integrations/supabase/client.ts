import { createClient } from '@supabase/supabase-js';

// Mengambil variabel dari file .env sesuai petunjuk resmi Supabase.
// Pastikan file .env Anda berisi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Membuat dan mengekspor client Supabase.
// Versi ini tidak menggunakan <Database> dari types.ts agar lebih sederhana.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

