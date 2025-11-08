"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPostById, getComments, addComment } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import CommentList from "@/components/comment-list/CommentList";
import CreateComment from "@/components/create-comment/CreateComment";

export default function PostDetail() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  async function loadData() {
    const postData = await getPostById(id as string);
    const commentsData = await getComments(id as string);
    setPost(postData);
    setComments(commentsData);
  }

  async function handleAddComment(content: string) {
    if (!token) {
      console.error("No hay token: el usuario no está autenticado.");
      router.push("/login");
      return;
    }

    await addComment(token, id as string, content);
    loadData();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {post && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-bold">{post.content}</h2>
          <p className="text-gray-500 text-sm mt-2">por {post.author}</p>
        </div>
      )}
      <CreateComment onAdd={handleAddComment} />
      <CommentList comments={comments} />
    </div>
  );
}
