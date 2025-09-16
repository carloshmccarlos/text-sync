import { env } from "~/env/server";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseKey = env.SUPABASE_KEY;
const supabaseUrl = env.SUPABASE_URL;

// Supabase client setup
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export as db for backward compatibility
export const db = supabase;
