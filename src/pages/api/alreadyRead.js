import { createClient } from "@supabase/supabase-js";

export default function handler(req, res) {
  const { id } = req.body;
  console.log("yayaya", id);
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseApiKey = process.env.SUPABASE_API_KEY;

  const supabase = createClient(supabaseUrl, supabaseApiKey);

  supabase
    .from("bookmarks")
    .update({ read: true })
    .eq("id", id)
    .then((response) => {
      console.log(response);
      res.status(200).json({ success: true });
    });
}
