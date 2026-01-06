import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import CodeSnippetsClientWrapper from "@/components/CodeSnippetsClientWrapper";

export default async function CodeSnippetsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const { supabase } = await createServerSupabaseClient();

  let query = supabase
    .from("code_snippets")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data: snippets, error } = await query;

  if (error) {
    console.error("Error fetching code snippets:", error);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Code Snippets</h1>
        <Link
          href="/code-snippets/new"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Plus size={20} />
          New Snippet
        </Link>
      </div>

      <CodeSnippetsClientWrapper initialSnippets={snippets || []} />
    </div>
  );
}
