"use client";

import { useState } from "react";

export default function IdeaGenerator() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const getIdea = async () => {
    setLoading(true);
    setIdea("");
    await fetch("/api/ideate", {
      method: "GET",
    })
      .then(async (res) => {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        setIdea(content || "No idea returned.");
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setIdea("Failed to load idea.");
        console.log(e);
      });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={getIdea}
        className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 italic"
      >
        {loading ? "Generating..." : "Generate Project Idea"}
      </button>
      {idea && <div className="text-lg bg-white p-3 rounded">{idea}</div>}
    </div>
  );
}
