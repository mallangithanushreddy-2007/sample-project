"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  taskTitle?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (e) {
      console.error("Delete task failed", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal */}
      <div className="glass-modal relative w-full max-w-md p-6 animate-slide-up z-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white">Delete Task?</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-200">
                "{taskTitle || "this task"}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 disabled:opacity-50 transition-all"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" /> Delete Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
