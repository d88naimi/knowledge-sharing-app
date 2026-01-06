"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/DeleteDialog";

export default function LearningResourceDetailClient({
  resourceId,
  isAuthor,
}: {
  resourceId: string;
  isAuthor: boolean;
}) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/learning-resources/${resourceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/learning-resources");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  if (!isAuthor) return null;

  return (
    <>
      <div className="flex gap-4 pt-6 border-t">
        <button
          onClick={() => router.push(`/learning-resources/${resourceId}/edit`)}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="px-4 py-2 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition"
        >
          Delete
        </button>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        resourceType="learning resource"
      />
    </>
  );
}
