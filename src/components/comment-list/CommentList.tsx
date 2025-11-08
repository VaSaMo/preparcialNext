"use client";

import { useEffect, useState } from "react";
import { getUsernameById } from "@/services/api";

export default function CommentList({ comments }: { comments: any[] }) {
  const [authors, setAuthors] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadAuthors() {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Llamadas paralelas para obtener todos los nombres
      const results = await Promise.all(
        comments.map(async (comment) => {
          const name = await getUsernameById(comment.user_id);
          return { id: comment.id, name };
        })
      );

      // Crear un mapa { commentId: username }
      const authorsMap = results.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr.name }),
        {}
      );

      setAuthors(authorsMap);
    }

    loadAuthors();
  }, [comments]);

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="p-3 bg-white rounded shadow-sm border">
          <p>{c.content}</p>
          <p className="text-sm text-gray-500">
            por {authors[c.id] || "Cargando..."}
          </p>
        </div>
      ))}
    </div>
  );
}
