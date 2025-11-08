"use client";

import { useEffect, useState } from "react";
import { getPosts, createPost } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import CreatePost from "@/components/create-post/CreatePost";
import PostList from "@/components/post-list/PostList";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
    else loadPosts();
  }, [token]);

  async function loadPosts() {
    const data = await getPosts();
    setPosts(data);
  }

  async function handleCreatePost(content: string) {
    await createPost(content);
    loadPosts();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Feed</h1>
      <CreatePost onCreate={handleCreatePost} />
      <PostList posts={posts} />
    </div>
  );
}
