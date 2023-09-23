import { createClient } from "@supabase/supabase-js";

export default function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseApiKey = process.env.SUPABASE_API_KEY;

  // Initialize the Supabase client
  const supabase = createClient(supabaseUrl, supabaseApiKey);

  let bookmarkTitles = "";

  supabase
    .from("bookmarks")
    .select("title")
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else if (data && data.length > 0) {
        bookmarkTitles = data.map((bookmark) => bookmark.title).join(" - ");
        res.status(200).json({ titles: bookmarkTitles });
      }
    })
    .catch((error) => {
      console.error("Error fetching bookmarks:", error);
    });
}
