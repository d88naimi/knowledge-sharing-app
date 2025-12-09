"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CodeSnippet } from "@/types";
import { formatDate } from "@/lib/utils";
import CodeHighlighter from "@/components/CodeHighlighter";

export default function CodeSnippetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchSnippet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const fetchSnippet = async () => {
    try {
      const response = await fetch(`/api/code-snippets/${params?.id}`);
      if (response.ok) {
        const data = await response.json();
        setSnippet(data);
      } else {
        router.push("/code-snippets");
      }
    } catch (error) {
      console.error("Error fetching snippet:", error);
      router.push("/code-snippets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this code snippet?")) return;

    try {
      const response = await fetch(`/api/code-snippets/${params?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/code-snippets");
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!snippet) {
    return <div>Code snippet not found</div>;
  }

  const isAuthor = session?.user?.id === snippet.author_id;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4">{snippet.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div>
              By{" "}
              <span className="font-medium">
                {snippet.author_name || "Anonymous"}
              </span>
            </div>
            <div>{formatDate(snippet.created_at)}</div>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
            {snippet.language}
          </span>
        </div>

        {snippet.description && (
          <p className="text-gray-600 mb-6">{snippet.description}</p>
        )}

        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {snippet.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mb-8">
          <CodeHighlighter code={snippet.code} language={snippet.language} />
        </div>

        {isAuthor && (
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={() => router.push(`/code-snippets/${snippet.id}/edit`)}
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
      </div>
    </div>
  );
}
