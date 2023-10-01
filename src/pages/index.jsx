import React, { useState } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";
import Marquee from "react-fast-marquee";

export default function Home({ bookmarksTitle, bookmarks }) {
  const [data, setData] = useState([...bookmarks]);
  const [bookmarksData, setBookmarksData] = useState([...data]);
  const [randomBookmark, setRandomBookmark] = useState({
    title: null,
    url: null,
    id: 0,
  });
  const [readCheckbox, setReadCheckbox] = useState(false);

  function getRandomBookmark() {
    if (data.length === 0) return;
    let updatedBookmarksData = bookmarksData;
    if (bookmarksData.length === 0) {
      updatedBookmarksData = [...data];
      setBookmarksData(updatedBookmarksData);
    }
    const randomIndex = Math.floor(Math.random() * updatedBookmarksData.length);
    const bookmark = updatedBookmarksData[randomIndex];
    updatedBookmarksData.splice(randomIndex, 1);
    setRandomBookmark({
      title: bookmark.title,
      url: bookmark.url,
      id: bookmark.id,
    });
    setBookmarksData(updatedBookmarksData);
  }

  async function handleReadCheckbox(e) {
    setReadCheckbox(e.target.checked);

    setTimeout(() => {
      if (e.target.checked) {
        const filteredBookmarks = data.filter(
          (bookmark) => bookmark.id !== randomBookmark.id
        );
        setData([...filteredBookmarks]);
        console.log(randomBookmark.id);
        const response = fetch("/api/alreadyRead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: randomBookmark.id }),
        });
        getRandomBookmark();
        setReadCheckbox(false);
      } else {
        setReadCheckbox(false);
      }
    }, 500);
  }

  return (
    <div className="h-screen overflow-hidden">
      <Head>
        <title>what should i read?</title>
        <meta
          property="description"
          content="a random bookmark from my reading list"
        />
        <meta property="og:title" content="what should i read?" />
        <meta
          property="og:description"
          content="a random bookmark from my reading list"
        />
        <meta property="og:image" content="/og.png" />
        <meta property="og:url" content="https://whatshouldiread.rittik.io" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="what should i read?" />
        <meta
          name="twitter:description"
          content="a random bookmark from my reading list"
        />
        <meta name="twitter:image" content="/og.png" />
      </Head>
      <div className="flex flex-col items-center h-full justify-center bg-zinc-900/90 gap-y-8 lg:gap-y-12">
        {data.length !== 0 && (
          <button
            className="group relative mx-auto inline-flex -mt-16 items-center overflow-hidden rounded-full bg-zinc-800 px-8 py-3 transition"
            onClick={getRandomBookmark}
          >
            <div className="absolute inset-0 flex items-center [container-type:inline-size]">
              <div className="absolute h-[100cqw] w-[100cqw] animate-spin bg-[conic-gradient(from_0_at_50%_50%,rgba(236,72,153,0.3)_0deg,transparent_60deg,transparent_300deg,rgba(236,72,153,0.3)_360deg)] transition duration-300 [animation-duration:3s] opacity-100"></div>
            </div>

            <div className="absolute inset-0.5 rounded-full bg-zinc-900"></div>

            <div className="absolute bottom-0 left-1/2 w-4/5 -translate-x-1/2 rounded-full bg-white/10 blur-md transition-all duration-500 h-2/3 opacity-100"></div>

            <span className="font-mono relative mt-px bg-gradient-to-b from-white/25 to-white group-hover:from-pink-900/10 group-hover:to-pink-300 bg-clip-text text-lg lg:text-2xl font-medium text-transparent transition-all duration-200">
              {" "}
              what should i read?{" "}
            </span>
          </button>
        )}
        {randomBookmark.url && data.length !== 0 && (
          <div className="text-center px-4 leading-7 lg:space-y-8 space-y-6">
            <a
              href={randomBookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 underline hover:decoration-pink-400/80 underline-offset-4 lg:text-2xl tracking-wider decoration-pink-500/60"
            >
              {randomBookmark.title}
            </a>

            <div className="flex items-center justify-center mb-4">
              <label
                htmlFor="read-checkbox"
                className="mr-2 text-sm lg:text-base tracking-widest text-zinc-400"
              >
                Already Read
              </label>
              <input
                id="read-checkbox"
                type="checkbox"
                checked={readCheckbox}
                onChange={handleReadCheckbox}
                disabled={readCheckbox}
                className="w-4 h-4 appearance-none cursor-pointer checked:bg-pink-500/60 checked:border-0 rounded accent-pink-500 bg-zinc-600"
              />
            </div>
          </div>
        )}

        {bookmarksData.length === 0 && data.length === 0 && (
          <div className="text-center px-4 leading-7 lg:space-y-8 space-y-6">
            <h2 className="lg:text-xl text-zinc-400 font-mono mb-2">
              No more bookmarks to read
            </h2>
          </div>
        )}
      </div>
      <Marquee
        gradient={false}
        className="bottom-6 font-mono text-pink-500/30 lg:text-base lg:bottom-7 text-sm"
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
  let bookmarks = [];

  await supabase
    .from("bookmarks")
    .select("id, title, url")
    .eq("read", false)
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else if (data && data.length > 0) {
        bookmarks = data.sort(() => Math.random() - 0.5);
      }
    })
    .catch((error) => {
      console.error("Error fetching bookmarks:", error);
    });

  await supabase
    .from("bookmarks")
    .select("title")
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else if (data && data.length > 0) {
        bookmarksTitle = data.map((bookmark) => bookmark.title).join(" • ");
      }
    })
    .catch((error) => {
      console.error("Error fetching bookmarks:", error);
    });

  return {
    props: {
      bookmarksTitle,
      bookmarks,
    },
  };
}
