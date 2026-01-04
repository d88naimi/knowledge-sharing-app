"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import SearchBar from "@/components/SearchBar";
import { CodeSnippet } from "@/types";

export default function CodeSnippetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchSnippets = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      const url = searchQuery
        ? `/api/code-snippets?search=${encodeURIComponent(searchQuery)}`
        : "/api/code-snippets";
      const response = await fetch(url);
      const data = await response.json();
      setSnippets(data);
    } catch (error) {
      console.error("Error fetching code snippets:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, status]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Code Snippets</h1>
        {session && (
          <Link
            href="/code-snippets/new"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            <Plus size={20} />
            New Snippet
          </Link>
        )}
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search code snippets..."
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : snippets.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No code snippets found.</p>
          {session && (
            <Link
              href="/code-snippets/new"
              className="text-slate-900 hover:underline mt-2 inline-block"
            >
              Create the first snippet
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {snippets.map((snippet) => (
            <ResourceCard
              key={snippet.id}
              resource={snippet}
              type="code_snippet"
            />
          ))}
        </div>
      )}
    </div>
  );
}
