import axios from "axios";

import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: number;
  username: string;
  exp: number;
}

export function getUserIdFromToken(token: string): number | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.id;
  } catch {
    return null;
  }
}

const API_URL = "http://localhost:8000"; 

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export async function loginUser(username: string, password: string) {
  try {
    const { data } = await api.post("/login", { username, password });
    console.log(data);
    return data; 
  } catch (error: any) {
    console.log(error.message);
    console.error("Error en login:", error.response?.data || error.message);
    return {
      error: true,
      message:
        error.response?.data?.message || "Error de autenticación en el servidor",
    };
  }
}

export async function getPosts() {
  try {
    const response = await api.get("/posts");
    return response.data; 
  } catch (error: any) {
    console.error("Error al obtener posts:", error.response?.data || error.message);
    return [];
  }
}

export async function createPost(content: string) {
  try {
    const response = await api.post("/posts", { content });
    return response.data;
  } catch (error: any) {
    console.error("Error al crear post:", error.response?.data || error.message);
    return { error: true };
  }
}

export async function getPostById(id: string) {
  try {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener post:", error.response?.data || error.message);
    return null;
  }
}


export async function getComments(postId: string) {
  try {
    const res = await api.get(`/posts/${postId}`);

    const post = res.data;
    const comments = post?.comments ?? [];

    return comments;
  } catch (error: any) {
    console.error("Error al obtener comentarios:", error.response?.data || error.message);
    return [];
  }
}


export async function addComment(token: string, postId: string, content: string) {
  try {
    const postRes = await api.get(`/posts/${postId}`);
    const post = postRes.data;

    const userId = getUserIdFromToken(token) ?? 0;

    const newComment = {
      id: Date.now(),
      content,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const updatedComments = [...(post.comments || []), newComment];

    const res = await api.put(
      `/posts/${postId}`,
      { ...post, comments: updatedComments }
    );

    return res.data;
  } catch (error: any) {
    console.error("Error al agregar comentario:", error.response?.data || error.message);
    return { error: true };
  }
}

export async function getUsernameById(userId: number): Promise<string> {
  try {
    const res = await api.get(`/users/${userId}`);

    const user = res.data;
    return user?.username || "Desconocido";
  } catch (error: any) {
    console.error(
      "Error al obtener el nombre del usuario:",
      error.response?.data || error.message
    );
    return "Desconocido";
  }
}


export default api;
