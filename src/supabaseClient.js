import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gqkzivcrswqphhuxjrab.supabase.co";
const supabaseAnonKey = "sb_publishable_OIrUD1EIDtEzjOjtb6H4kg_djZpxQ-q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);