import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gqkzivcrswqphhuxjrab.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxa3ppdmNyc3dxcGhodXhqcmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDgwMDQsImV4cCI6MjA4ODM4NDAwNH0.KxsL8bT9GuoB0-KQwVpT0B8mp7SGuG9Gyd79LP8NN4A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);