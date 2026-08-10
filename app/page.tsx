"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Task,
  TaskFilters as ITaskFilters,
  TaskStats as ITaskStats,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { TaskStats } from "@/components/TaskStats";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskList } from "@/components/TaskList";
import { TaskFormModal } from "@/components/TaskFormModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<ITaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
    completionRate: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<ITaskFilters>({
    search: "",
    status: "all",
    priority: "all",
    category: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Trigger notification toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch tasks & stats from API
  const fetchTasks = useCallback(
    async (showLoader = false) => {
      if (showLoader) setIsLoading(true);
      setIsRefreshing(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.set("search", filters.search);
        if (filters.status !== "all") queryParams.set("status", filters.status);
        if (filters.priority !== "all") queryParams.set("priority", filters.priority);
        if (filters.category !== "all") queryParams.set("category", filters.category);
        queryParams.set("sortBy", filters.sortBy);
        queryParams.set("sortOrder", filters.sortOrder);

        const res = await fetch(`/api/tasks?${queryParams.toString()}`);
        const json = await res.json();

        if (json.success) {
          setTasks(json.data || []);
          if (json.stats) setStats(json.stats);
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchTasks(true);
  }, [fetchTasks]);

  // Handle Task Creation or Update
  const handleSaveTask = async (input: CreateTaskInput | UpdateTaskInput) => {
    if (editingTask) {
      // PATCH /api/tasks/[id]
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast("Task updated successfully!");
    } else {
      // POST /api/tasks
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast("Task created successfully!");
    }
    fetchTasks(false);
  };

  // Quick Toggle Complete
  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );

      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          newStatus === "completed"
            ? "Task marked as completed! 🎉"
            : "Task marked as pending"
        );
      }
      fetchTasks(false);
    } catch (err) {
      console.error("Toggle complete failed", err);
      fetchTasks(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;
    try {
      const res = await fetch(`/api/tasks/${deletingTaskId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast("Task deleted successfully");
      fetchTasks(false);
    } catch (err: any) {
      console.error("Delete task failed", err);
    }
  };

  // Seed Sample Tasks
  const handleSeedDemo = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/tasks/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        showToast("Sample tasks loaded successfully!");
        fetchTasks(true);
      }
    } catch (err) {
      console.error("Seed tasks failed", err);
      setIsLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      category: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const targetDeleteTask = tasks.find((t) => t.id === deletingTaskId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-xl shadow-indigo-600/40 border border-indigo-400/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsFormModalOpen(true);
        }}
        onRefresh={() => fetchTasks(true)}
        isRefreshing={isRefreshing}
        totalTasksCount={stats.total}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Workspace Title Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Workspace Overview
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Manage your project tasks, track status, priorities, and deadlines efficiently.
            </p>
          </div>

          <button
            onClick={handleSeedDemo}
            className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Load Sample Tasks</span>
          </button>
        </div>

        {/* Analytics & Progress Cards */}
        <TaskStats stats={stats} />

        {/* Filter, Search & Sorting Controls */}
        <TaskFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Tasks List Grid */}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenEdit}
          onDelete={(id) => setDeletingTaskId(id)}
          onOpenCreateModal={() => {
            setEditingTask(null);
            setIsFormModalOpen(true);
          }}
          onSeedDemo={handleSeedDemo}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} TaskFlow. Production-Ready Next.js & PostgreSQL Application.</p>
        </div>
      </footer>

      {/* Modals */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteTask}
        taskTitle={targetDeleteTask?.title}
      />
    </div>
  );
}
