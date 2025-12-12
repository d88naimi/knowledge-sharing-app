"use client";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resourceType?: string;
}

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  resourceType = "resource",
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white border border-slate-300 rounded-md p-6 max-w-md w-full flex flex-col gap-4">
          {/* Content */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Are you sure you want to delete this {resourceType}?
            </h2>
            <p className="text-sm text-slate-500 leading-5">
              This action cannot be undone. This will permanently delete your{" "}
              {resourceType} and remove your data from our servers.
            </p>
          </div>

          {/* Button Section */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="bg-white border border-slate-200 px-4 py-2 rounded-md text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="bg-slate-900 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
