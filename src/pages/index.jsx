import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Marquee from "react-fast-marquee";

export default function Home({ bookmarksTitle }) {
  console.log(bookmarksTitle);
  const [randomBookmark, setRandomBookmark] = useState({
    title: null,
    url: null,
  });

  const handleFetchRandomBookmark = async () => {
    try {
      const response = await fetch("/api/getRandomBookmark");
      const link = await response.json();
      console.log("Random bookmark:", link);
      setRandomBookmark({ title: link.title, url: link.url });
    } catch (error) {
      console.error("Error fetching random bookmark:", error);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex flex-col items-center h-full justify-center bg-zinc-900/90 gap-y-8 lg:gap-y-12">
        <button
          className="group relative mx-auto inline-flex -mt-16 items-center overflow-hidden rounded-full bg-zinc-800 px-8 py-3 transition"
          onClick={handleFetchRandomBookmark}
        >
          <div className="absolute inset-0 flex items-center [container-type:inline-size]">
            <div className="absolute h-[100cqw] w-[100cqw] animate-spin bg-[conic-gradient(from_0_at_50%_50%,rgba(236,72,153,0.3)_0deg,transparent_60deg,transparent_300deg,rgba(236,72,153,0.3)_360deg)] transition duration-300 [animation-duration:3s] opacity-100"></div>
          </div>

          <div className="absolute inset-0.5 rounded-full bg-zinc-900"></div>

          <div className="absolute bottom-0 left-1/2 w-4/5 -translate-x-1/2 rounded-full bg-white/10 blur-md transition-all duration-500 h-2/3 opacity-100"></div>

          <span className="font-mono relative mt-px bg-gradient-to-b from-white/25 to-white bg-clip-text text-lg lg:text-2xl font-medium text-transparent transition-all duration-200">
            {" "}
            what should i read?{" "}
          </span>
        </button>
        {randomBookmark.url && (
          <div className="text-center px-4 leading-7 lg:space-y-8 space-y-6">
            {/* <h2 className="text-2xl font-bold mb-2">Random Link:</h2> */}
            <a
              href={randomBookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 underline underline-offset-4 lg:text-2xl tracking-wider decoration-pink-500/60"
            >
              {randomBookmark.title}
            </a>

            <div className="flex items-center justify-center mb-4">
              <label
                for="read-checkbox"
                className="mr-2 text-sm lg:text-base tracking-widest text-zinc-400"
              >
                Already Read
              </label>
              <input
                id="read-checkbox"
                type="checkbox"
                // checked={false}
                className="w-4 h-4 appearance-none checked:bg-pink-500/60 checked:border-0 rounded accent-pink-500 bg-zinc-600"
              />
            </div>
          </div>
        )}
      </div>
      <Marquee
        gradient={false}
        className="bottom-6 font-mono text-zinc-500 lg:text-base lg:bottom-7 text-sm"
      >
        {bookmarksTitle}
      </Marquee>
    </div>
  );
}

export async function getStaticProps() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  // Initialize the Supabase client
  const supabase = createClient(supabaseUrl, supabaseApiKey);

  let bookmarksTitle = "";

  await supabase
    .from("bookmarks")
    .select("title")
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else if (data && data.length > 0) {
        // Concatenate all bookmark titles into a single string
        bookmarksTitle = data.map((bookmark) => bookmark.title).join(" • ");
      }
    })
    .catch((error) => {
      console.error("Error fetching bookmarks:", error);
    });

  return {
    props: {
      bookmarksTitle,
    },
  };
}
