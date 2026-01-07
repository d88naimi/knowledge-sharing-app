import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { createApiSupabaseClient } from "@/lib/supabase-api";
import LearningResourcesClientWrapper from "@/components/LearningResourcesClientWrapper";

export default async function LearningResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const { supabase } = await createApiSupabaseClient();

  let query = supabase
    .from("learning_resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data: resources, error } = await query;

  if (error) {
    console.error("Error fetching learning resources:", error);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <Link
          href="/learning-resources/new"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Plus size={20} />
          New Resource
        </Link>
      </div>

      <LearningResourcesClientWrapper initialResources={resources || []} />
    </div>
  );
}
