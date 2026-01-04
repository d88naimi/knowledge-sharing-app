"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Article, CodeSnippet, LearningResource } from "@/types";
import {
  Newspaper,
  Code,
  ExternalLink,
  Pencil,
  Trash2,
  CircleUser,
} from "lucide-react";
import { useSession } from "next-auth/react";
import DeleteDialog from "@/components/DeleteDialog";

interface ResourceCardProps {
  resource: Article | CodeSnippet | LearningResource;
  type: "article" | "code_snippet" | "learning_resource";
  onDelete?: () => void;
}

export default function ResourceCard({
  resource,
  type,
  onDelete,
}: ResourceCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isOwner = session?.user?.id === resource.author_id;

  const getIcon = () => {
    switch (type) {
      case "article":
        return <Newspaper className="text-black" size={20} />;
      case "code_snippet":
        return <Code className="text-black" size={20} />;
      case "learning_resource":
        return <ExternalLink className="text-black" size={20} />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "article":
        return "Article";
      case "code_snippet":
        return "Code Snippet";
      case "learning_resource":
        return "Learning Resource";
    }
  };

  const getLink = () => {
    switch (type) {
      case "article":
        return `/articles/${resource.id}`;
      case "code_snippet":
        return `/code-snippets/${resource.id}`;
      case "learning_resource":
        return `/learning-resources/${resource.id}`;
    }
  };

  const getEditLink = () => {
    switch (type) {
      case "article":
        return `/articles/${resource.id}/edit`;
      case "code_snippet":
        return `/code-snippets/${resource.id}/edit`;
      case "learning_resource":
        return `/learning-resources/${resource.id}/edit`;
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(getEditLink());
  };

  const handleDelete = async () => {
    try {
      const apiPath =
        type === "article"
          ? `/api/articles/${resource.id}`
          : type === "code_snippet"
          ? `/api/code-snippets/${resource.id}`
          : `/api/learning-resources/${resource.id}`;

      const response = await fetch(apiPath, {
        method: "DELETE",
      });

      if (response.ok) {
        // Call onDelete callback if provided, otherwise refresh
        if (onDelete) {
          onDelete();
        } else {
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const getDescription = () => {
    if ("description" in resource && resource.description) {
      return resource.description;
    }
    if ("content" in resource) {
      return resource.content;
    }
    return "";
  };

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.12)] rounded-2xl p-4">
      <div className="flex flex-col gap-2.5 pt-2.5">
        {/* Header with type badge and action buttons */}
        <div className="flex items-center justify-between">
          <div className="bg-white border border-[rgba(0,0,0,0.15)] flex gap-2 h-7 items-center justify-center px-2 rounded-full">
            {getIcon()}
            <p className="font-medium text-sm leading-3.5 text-black">
              {getTypeLabel()}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2.5 items-center">
              <button onClick={handleEdit} className="w-6 h-6">
                <Pencil className="text-black" size={24} />
              </button>
              <button onClick={handleDeleteClick} className="w-6 h-6">
                <Trash2 className="text-black" size={24} />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-7 text-[#0f172a]">
          {resource.title}
        </h3>

        {/* Description and View Link */}
        <div className="flex flex-col gap-2.5">
          <p className="font-normal text-base leading-7 text-[#0f172a]">
            {getDescription()}
          </p>
          <Link href={getLink()} className="flex gap-2 items-center">
            <ExternalLink className="text-[#0f172a]" size={20} />
            <span className="font-bold text-base leading-7 text-[#0f172a] underline">
              View{" "}
              {type === "article"
                ? "article"
                : type === "code_snippet"
                ? "snippet"
                : "resource"}
            </span>
          </Link>
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-col py-1 pt-1 pb-2">
            <div className="flex flex-wrap gap-2.5">
              {resource.tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-white border border-[rgba(0,0,0,0.15)] flex h-[22px] items-center justify-center px-2 rounded-full"
                >
                  <p className="font-medium text-xs leading-5 text-black">
                    {tag}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px w-full bg-[rgba(0,0,0,0.12)]" />

        {/* Footer with author and date */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <CircleUser className="text-black" size={36} />
            <p className="font-normal text-base leading-7 text-black text-center">
              {resource.author_name || "You"}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-normal text-base leading-7 text-[rgba(0,0,0,0.5)] text-center">
              {formatDate(resource.created_at)}
            </p>
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        resourceType={
          type === "article"
            ? "article"
            : type === "code_snippet"
            ? "code snippet"
            : "learning resource"
        }
      />
    </div>
  );
}
