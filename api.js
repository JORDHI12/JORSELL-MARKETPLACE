// api.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://dukipkyrhvvoaxjtlazf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1a2lwa3lyaHZ2b2F4anRsYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3OTkzNTYsImV4cCI6MjA3NzM3NTM1Nn0._b24puVhVXXe7hAHfng_FLHSxrZK9_LfCoXa0Jvwfj8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
