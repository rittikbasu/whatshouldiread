import { createClient } from "@supabase/supabase-js";

export default function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseApiKey = process.env.SUPABASE_API_KEY;

  const supabase = createClient(supabaseUrl, supabaseApiKey);

  supabase
    .from("bookmarks")
    .select()
    .eq("read", false)
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        console.log(data);
        res
          .status(200)
          .json({ url: data[randomIndex].url, title: data[randomIndex].title });
      }
    })
    .catch((error) => {
      console.error("Error fetching bookmarks:", error);
    });
}
