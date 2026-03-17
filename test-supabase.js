import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gqkzivcrswqphhuxjrab.supabase.co";
const supabaseAnonKey = "sb_publishable_OIrUD1EIDtEzjOjtb6H4kg_djZpxQ-q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  console.log("Fetching bins...");
  const { data, error } = await supabase.from("bins").select("*");
  console.log("Data:", data);
  if (error) {
    console.error("Error:", error);
  }
}

runTest();
