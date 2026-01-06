"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import ResourceCard from "@/components/ResourceCard";
import { Article, CodeSnippet, LearningResource } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";

type UnifiedResource = (Article | CodeSnippet | LearningResource) & {
  resourceType: "article" | "code_snippet" | "learning_resource";
};

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: articles = [], isLoading: articlesLoading } = useSWR<Article[]>(
    status === "authenticated" ? "/api/articles" : null
  );
  const { data: snippets = [], isLoading: snippetsLoading } = useSWR<
    CodeSnippet[]
  >(status === "authenticated" ? "/api/code-snippets" : null);
  const { data: learningResources = [], isLoading: resourcesLoading } = useSWR<
    LearningResource[]
  >(status === "authenticated" ? "/api/learning-resources" : null);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const isLoading = articlesLoading || snippetsLoading || resourcesLoading;

  const resources: UnifiedResource[] = [
    ...articles.map((a) => ({
      ...a,
      resourceType: "article" as const,
    })),
    ...snippets.map((s) => ({
      ...s,
      resourceType: "code_snippet" as const,
    })),
    ...learningResources.map((r) => ({
      ...r,
      resourceType: "learning_resource" as const,
    })),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const refreshAllResources = () => {
    mutate("/api/articles");
    mutate("/api/code-snippets");
    mutate("/api/learning-resources");
  };

  const filteredResources = resources.filter((resource) => {
    if (
      selectedTypes.length > 0 &&
      !selectedTypes.includes(resource.resourceType)
    ) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const title = resource.title.toLowerCase();
      const description =
        "description" in resource
          ? resource.description?.toLowerCase() || ""
          : "content" in resource
          ? resource.content?.toLowerCase() || ""
          : "";
      if (!title.includes(query) && !description.includes(query)) {
        return false;
      }
    }

    if (selectedTags.length > 0 && resource.tags) {
      const hasSelectedTag = selectedTags.some((tag) =>
        resource.tags?.includes(tag)
      );
      if (!hasSelectedTag) {
        return false;
      }
    }

    return true;
  });

  const allTags = Array.from(
    new Set(
      resources
        .flatMap((r) => r.tags || [])
        .filter((tag): tag is string => typeof tag === "string")
    )
  ).sort();

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-12">
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <div className="pt-[74px] pb-6">
          <h1 className="font-semibold text-[30px] leading-9 tracking-[-0.225px] text-[#0f172a] mb-2">
            Discover Resources
          </h1>
          <p className="font-normal text-[20px] leading-7 tracking-[-0.1px] text-[#0f172a] mb-6">
            Explore shared knowledge from our community
          </p>

          {/* Search Bar */}
          <div className="flex gap-2 items-start">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="text-[#94a3b8]" size={24} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resource..."
                className="w-full pl-11 pr-4 py-2 bg-white border border-[#cbd5e1] rounded-md text-[16px] leading-6 text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-white border border-[rgba(0,0,0,0.1)] flex gap-2 items-center justify-center px-4 py-2 rounded-md"
            >
              <SlidersHorizontal className="text-black" size={24} />
              <span className="font-medium text-sm text-black">Filter</span>
            </button>
          </div>
        </div>

        {/* Main Content: Filters + Resources */}
        <div className="flex gap-8 pb-12">
          {/* Left Sidebar - Filters (hidden on mobile) */}
          <div className="w-60 shrink-0 hidden md:block">
            <div className="bg-white border border-[rgba(0,0,0,0.12)] rounded-2xl p-4">
              <div className="py-2">
                <h3 className="font-semibold text-[18px] leading-7 text-[#0f172a] mb-2">
                  Filters
                </h3>

                {/* Resource Type Filters */}
                <div className="mb-6">
                  <p className="font-normal text-[16px] leading-7 text-[#0f172a] mb-2">
                    Resource Type
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes("article")}
                        onChange={() => toggleType("article")}
                        className="w-3.5 h-3.5 border border-[#e5e7eb] rounded-sm"
                      />
                      <span className="font-medium text-[14px] leading-3.5 text-black">
                        Articles
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes("code_snippet")}
                        onChange={() => toggleType("code_snippet")}
                        className="w-3.5 h-3.5 border border-[#e5e7eb] rounded-sm"
                      />
                      <span className="font-medium text-[14px] leading-3.5 text-black">
                        Code Snippets
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes("learning_resource")}
                        onChange={() => toggleType("learning_resource")}
                        className="w-3.5 h-3.5 border border-[#e5e7eb] rounded-sm"
                      />
                      <span className="font-medium text-[14px] leading-3.5 text-black">
                        Learning Resources
                      </span>
                    </label>
                  </div>
                </div>

                {/* Tags Filters */}
                {allTags.length > 0 && (
                  <div>
                    <p className="font-normal text-[16px] leading-7 text-[#0f172a] mb-2">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-2 h-[22px] rounded-full text-[12px] font-medium leading-5 transition ${
                            selectedTags.includes(tag)
                              ? "bg-slate-900 text-white border border-slate-900"
                              : "bg-white text-black border border-[rgba(0,0,0,0.15)] hover:border-slate-900"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Resources */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4">
              <p className="font-normal text-[16px] leading-7 text-[#0f172a]">
                {filteredResources.length} resource
                {filteredResources.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p>No resources found.</p>
                {searchQuery && (
                  <p className="mt-2">Try adjusting your search or filters.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={`${resource.resourceType}-${resource.id}`}
                    resource={resource}
                    type={resource.resourceType}
                    onDelete={refreshAllResources}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
