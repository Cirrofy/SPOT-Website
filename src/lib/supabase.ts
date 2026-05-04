import { createClient } from '@supabase/supabase-js';

// Pastikan namanya sama persis dengan yang ada di .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables!");
}

// Menginisialisasi dan mengekspor client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);