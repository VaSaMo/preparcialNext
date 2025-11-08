"use client";

import { useState } from "react";

export default function CreateComment({ onAdd }: { onAdd: (content: string) => void }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe un comentario..."
        className="w-full border p-2 rounded mb-3"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Comentar</button>
    </form>
  );
}
