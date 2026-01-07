import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { createApiSupabaseClient } from "@/lib/supabase-api";
import { formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import LearningResourceDetailClient from "@/components/LearningResourceDetailClient";

export default async function LearningResourceDetailPage({
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

  const { data: resource, error } = await supabase
    .from("learning_resources")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !resource) {
    notFound();
  }

  const isAuthor = session?.user?.id === resource.author_id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div>
              By{" "}
              <span className="font-medium">
                {resource.author_name || "Anonymous"}
              </span>
            </div>
            <div>{formatDate(resource.created_at)}</div>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded capitalize">
            {resource.resource_type}
          </span>
        </div>

        <p className="text-gray-600 mb-6">{resource.description}</p>

        <div className="mb-6">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Visit Resource
            <ExternalLink size={18} />
          </a>
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {resource.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-100 text-slate-900 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <LearningResourceDetailClient
          resourceId={resource.id}
          isAuthor={isAuthor}
        />
      </div>
    </div>
  );
}
