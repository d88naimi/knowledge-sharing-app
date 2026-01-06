"use client";

import { useRouter } from "next/navigation";
import ResourceCard from "@/components/ResourceCard";
import SearchBar from "@/components/SearchBar";
import { CodeSnippet } from "@/types";

export default function CodeSnippetsClientWrapper({
  initialSnippets,
}: {
  initialSnippets: CodeSnippet[];
}) {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query) {
      router.push(`/code-snippets?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/code-snippets");
    }
  };

  return (
    <>
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search code snippets..."
        />
      </div>

      {initialSnippets.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No code snippets found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {initialSnippets.map((snippet) => (
            <ResourceCard
              key={snippet.id}
              resource={snippet}
              type="code_snippet"
            />
          ))}
        </div>
      )}
    </>
  );
}
