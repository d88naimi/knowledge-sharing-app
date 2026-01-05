"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import SearchBar from "@/components/SearchBar";
import { Article } from "@/types";

export default function ArticlesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchArticles();
    }
  }, [searchQuery, status]);

  const fetchArticles = async () => {
    try {
      const url = searchQuery
        ? `/api/articles?search=${encodeURIComponent(searchQuery)}`
        : "/api/articles";
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold">Articles</h1>
        {session && (
          <Link
            href="/articles/new"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            <Plus size={20} />
            New Article
          </Link>
        )}
      </div>

      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} placeholder="Search articles..." />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No articles found.</p>
          {session && (
            <Link
              href="/articles/new"
              className="text-slate-900 hover:underline mt-2 inline-block"
            >
              Create the first article
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <ResourceCard key={article.id} resource={article} type="article" />
          ))}
        </div>
      )}
    </div>
  );
}
