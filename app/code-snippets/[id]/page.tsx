"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { CodeSnippet } from "@/types";
import { formatDate } from "@/lib/utils";
import CodeHighlighter from "@/components/CodeHighlighter";
import DeleteDialog from "@/components/DeleteDialog";

export default function CodeSnippetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: snippet, isLoading } = useSWR<CodeSnippet>(
    status === "authenticated" && params?.id
      ? `/api/code-snippets/${params.id}`
      : null,
    {
      onError: () => router.push("/code-snippets"),
    }
  );

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleDelete = async () => {
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

  if (status === "loading" || isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
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
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        resourceType="code snippet"
      />
    </div>
  );
}
