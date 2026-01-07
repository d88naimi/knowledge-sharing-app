import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { createApiSupabaseClient } from "@/lib/supabase-api";
import { formatDate } from "@/lib/utils";
import CodeHighlighter from "@/components/CodeHighlighter";
import CodeSnippetDetailClient from "@/components/CodeSnippetDetailClient";

export default async function CodeSnippetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const { supabase } = await createApiSupabaseClient();

  const { data: snippet, error } = await supabase
    .from("code_snippets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !snippet) {
    notFound();
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
            {snippet.tags.map((tag: string, index: number) => (
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

        <CodeSnippetDetailClient snippetId={snippet.id} isAuthor={isAuthor} />
      </div>
    </div>
  );
}
