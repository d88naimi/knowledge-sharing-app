import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { createApiSupabaseClient } from "@/lib/supabase-api";
import { formatDate } from "@/lib/utils";
import ArticleDetailClient from "@/components/ArticleDetailClient";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 15+
  const { id } = await params;

  // Check authentication on the server
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch article directly on the server
  const { supabase } = await createApiSupabaseClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
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
            {article.tags.map((tag: string, index: number) => (
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

        <ArticleDetailClient articleId={article.id} isAuthor={isAuthor} />
      </article>
    </div>
  );
}
