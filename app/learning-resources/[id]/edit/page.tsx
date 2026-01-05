"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const RESOURCE_TYPES = ["video", "article", "course", "documentation", "other"];

interface LearningResource {
  id: string;
  title: string;
  url: string;
  description: string;
  resource_type: string;
  tags: string[];
  author_id: string;
}

export default function EditLearningResourcePage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("article");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && params.id) {
      const fetchLearningResource = async () => {
        try {
          const response = await fetch(`/api/learning-resources/${params.id}`);
          if (response.ok) {
            const data: LearningResource = await response.json();

            // Check if user is the author
            if (data.author_id !== session?.user?.id) {
              setError(
                "You don't have permission to edit this learning resource"
              );
              return;
            }

            setTitle(data.title);
            setUrl(data.url);
            setDescription(data.description || "");
            setResourceType(data.resource_type);
            setTags(data.tags.join(", "));
          } else {
            setError("Failed to load learning resource");
          }
        } catch {
          setError("An error occurred while loading the learning resource");
        } finally {
          setIsLoading(false);
        }
      };

      fetchLearningResource();
    }
  }, [status, params.id, router, session?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/learning-resources/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          url,
          description,
          resource_type: resourceType,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        router.push(`/learning-resources/${params.id}`);
      } else {
        setError("Failed to update learning resource");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="max-w-4xl mx-auto">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Learning Resource</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border p-8"
      >
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            placeholder="Enter resource title"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            placeholder="https://example.com/resource"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="resourceType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Resource Type
          </label>
          <select
            id="resourceType"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            placeholder="Describe this learning resource (optional)"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            placeholder="Enter tags separated by commas"
          />
          <p className="mt-1 text-sm text-gray-500">
            Example: javascript, tutorial, beginner
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/learning-resources/${params.id}`)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
