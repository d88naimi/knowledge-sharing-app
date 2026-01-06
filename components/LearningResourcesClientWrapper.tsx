"use client";

import { useRouter } from "next/navigation";
import ResourceCard from "@/components/ResourceCard";
import SearchBar from "@/components/SearchBar";
import { LearningResource } from "@/types";

export default function LearningResourcesClientWrapper({
  initialResources,
}: {
  initialResources: LearningResource[];
}) {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query) {
      router.push(`/learning-resources?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/learning-resources");
    }
  };

  return (
    <>
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search learning resources..."
        />
      </div>

      {initialResources.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No learning resources found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {initialResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              type="learning_resource"
            />
          ))}
        </div>
      )}
    </>
  );
}
