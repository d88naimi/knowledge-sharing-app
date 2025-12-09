"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import SearchBar from "@/components/SearchBar";
import { LearningResource } from "@/types";

export default function LearningResourcesPage() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchResources = useCallback(async () => {
    try {
      const url = searchQuery
        ? `/api/learning-resources?search=${encodeURIComponent(searchQuery)}`
        : "/api/learning-resources";
      const response = await fetch(url);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Error fetching learning resources:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        {session && (
          <Link
            href="/learning-resources/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            New Resource
          </Link>
        )}
      </div>

      <div className="mb-6">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search learning resources..."
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No learning resources found.</p>
          {session && (
            <Link
              href="/learning-resources/new"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Add the first resource
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              type="learning_resource"
            />
          ))}
        </div>
      )}
    </div>
  );
}
