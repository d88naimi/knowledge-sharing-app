"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchArticle();
    }
  }, [params?.id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params?.id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else {
        router.push("/articles");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      router.push("/articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;

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

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
