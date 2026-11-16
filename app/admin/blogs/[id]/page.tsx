"use client";

import { useParams } from "next/navigation";
import BlogForm from "../BlogForm";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  return <BlogForm postId={Number.isFinite(postId) ? postId : undefined} />;
}
