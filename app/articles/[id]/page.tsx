"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import DeleteDialog from "@/components/DeleteDialog";

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    data: article,
    error,
    isLoading,
  } = useSWR<Article>(
    status === "authenticated" && params?.id
      ? `/api/articles/${params.id}`
      : null,
    {
      onError: () => router.push("/articles"),
    }
  );

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/articles/${params?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/articles");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return <div>Article not found</div>;
  }

  const isAuthor = session?.user?.id === article.author_id;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-sm border p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              By{" "}
              <span className="font-medium">
                {article.author_name || "Anonymous"}
              </span>
            </div>
            <div>{formatDate(article.created_at)}</div>
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-8">
          <p className="whitespace-pre-wrap">{article.content}</p>
        </div>

        {isAuthor && (
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={() => router.push(`/articles/${article.id}/edit`)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="px-4 py-2 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition"
            >
              Delete
            </button>
          </div>
        )}
      </article>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        resourceType="article"
      />
    </div>
  );
}
