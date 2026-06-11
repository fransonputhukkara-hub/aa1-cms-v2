import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface DbProduct {
  id: string;
  name: string;
  category: string | null;
  in_stock: number;
  selling_rate: number;
  mrp: number | null;
  is_new: boolean;
  image_url: string | null;
  group_name: string | null;
  color: string | null;
}
