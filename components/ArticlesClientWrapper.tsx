"use client";

import { useRouter } from "next/navigation";
import ResourceCard from "@/components/ResourceCard";
import SearchBar from "@/components/SearchBar";
import { Article } from "@/types";

export default function ArticlesClientWrapper({
  initialArticles,
}: {
  initialArticles: Article[];
}) {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query) {
      router.push(`/articles?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/articles");
    }
  };

  return (
    <>
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search articles..." />
      </div>

      {initialArticles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No articles found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {initialArticles.map((article) => (
            <ResourceCard key={article.id} resource={article} type="article" />
          ))}
        </div>
      )}
    </>
  );
}
