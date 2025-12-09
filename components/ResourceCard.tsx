"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Article, CodeSnippet, LearningResource } from "@/types";
import { BookOpen, Code, GraduationCap, User, Calendar } from "lucide-react";

interface ResourceCardProps {
  resource: Article | CodeSnippet | LearningResource;
  type: "article" | "code_snippet" | "learning_resource";
}

export default function ResourceCard({ resource, type }: ResourceCardProps) {
  const getIcon = () => {
    switch (type) {
      case "article":
        return <BookOpen className="text-blue-600" size={20} />;
      case "code_snippet":
        return <Code className="text-green-600" size={20} />;
      case "learning_resource":
        return <GraduationCap className="text-purple-600" size={20} />;
    }
  };

  const getLink = () => {
    const slug = type.replace("_", "-");
    return `/${slug}/${resource.id}`;
  };

  return (
    <Link href={getLink()}>
      <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">
              {resource.title}
            </h3>
          </div>
        </div>

        {"description" in resource && resource.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {resource.description}
          </p>
        )}

        {"content" in resource && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {resource.content.substring(0, 150)}...
          </p>
        )}

        {type === "code_snippet" && "language" in resource && (
          <div className="mb-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {resource.language}
            </span>
          </div>
        )}

        {type === "learning_resource" && "resource_type" in resource && (
          <div className="mb-3">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded capitalize">
              {resource.resource_type}
            </span>
          </div>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{resource.author_name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(resource.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
