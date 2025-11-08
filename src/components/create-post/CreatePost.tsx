"use client";

import { useState } from "react";

export default function CreatePost({ onCreate }: { onCreate: (content: string) => void }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onCreate(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe un nuevo post..."
        className="w-full border p-2 rounded mb-3"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Publicar</button>
    </form>
  );
}
