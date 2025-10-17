import { createClient } from "@supabase/supabase-js";
import { env } from "~/env/server";

const supabaseKey = env.SUPABASE_KEY;
const supabaseUrl = env.SUPABASE_URL;

// Supabase client setup
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export as db for backward compatibility
export const db = supabase;
