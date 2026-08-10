"use client";

import React from "react";
import { Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Sparkles, Inbox, Plus, Loader2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenCreateModal: () => void;
  onSeedDemo: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenCreateModal,
  onSeedDemo,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="glass-card p-5 space-y-4 animate-pulse border-slate-800/50"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 rounded bg-slate-800" />
              <div className="h-5 w-16 rounded bg-slate-800" />
            </div>
            <div className="h-6 w-3/4 rounded bg-slate-800" />
            <div className="h-10 w-full rounded bg-slate-800/60" />
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded bg-slate-800" />
                <div className="h-8 w-8 rounded bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-12 text-center flex flex-col items-center justify-center my-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">No tasks found</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
          No tasks match your current search query or active filter settings. You can create a new task or seed sample data.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            <Plus className="h-4 w-4" /> Create New Task
          </button>

          <button
            onClick={onSeedDemo}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" /> Seed Sample Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
