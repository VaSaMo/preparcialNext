"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsernameById } from "@/services/api"; 

export default function PostList({ posts }: { posts: any[] }) {
  const router = useRouter();
  const [authors, setAuthors] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadAuthors() {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Ejecuta todas las peticiones en paralelo
      const results = await Promise.all(
        posts.map(async (post) => {
          const name = await getUsernameById(post.user_id);
          return { id: post.id, name };
        })
      );

      // Convierte el arreglo a un objeto { postId: username }
      const authorsMap = results.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr.name }),
        {}
      );

      setAuthors(authorsMap);
    }

    loadAuthors();
  }, [posts]);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
          onClick={() => router.push(`/post/${post.id}`)}
        >
          <p>{post.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            por {authors[post.id] || "Cargando..."}
          </p>
        </div>
      ))}
    </div>
  );
}
