"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LearningResource } from "@/types";
import { formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export default function LearningResourceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [resource, setResource] = useState<LearningResource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchResource();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/learning-resources/${params?.id}`);
      if (response.ok) {
        const data = await response.json();
        setResource(data);
      } else {
        router.push("/learning-resources");
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
      router.push("/learning-resources");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this learning resource?"))
      return;

    try {
      const response = await fetch(`/api/learning-resources/${params?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/learning-resources");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!resource) {
    return <div>Learning resource not found</div>;
  }

  const isAuthor = session?.user?.id === resource.author_id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div>
              By{" "}
              <span className="font-medium">
                {resource.author_name || "Anonymous"}
              </span>
            </div>
            <div>{formatDate(resource.created_at)}</div>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded capitalize">
            {resource.resource_type}
          </span>
        </div>

        <p className="text-gray-600 mb-6">{resource.description}</p>

        <div className="mb-6">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Visit Resource
            <ExternalLink size={18} />
          </a>
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {resource.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {isAuthor && (
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={() =>
                router.push(`/learning-resources/${resource.id}/edit`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
