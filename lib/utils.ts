import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskPriority, TaskStatus, TaskCategory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "No due date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function isOverdue(dateString: string | null, status: TaskStatus): boolean {
  if (!dateString || status === "completed") return false;
  const due = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function getPriorityBadgeStyle(priority: TaskPriority): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (priority) {
    case "urgent":
      return {
        bg: "bg-rose-500/10 hover:bg-rose-500/20",
        text: "text-rose-400",
        border: "border-rose-500/30",
        dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
      };
    case "high":
      return {
        bg: "bg-amber-500/10 hover:bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
        dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
      };
    case "medium":
      return {
        bg: "bg-indigo-500/10 hover:bg-indigo-500/20",
        text: "text-indigo-400",
        border: "border-indigo-500/30",
        dot: "bg-indigo-500",
      };
    case "low":
    default:
      return {
        bg: "bg-slate-500/10 hover:bg-slate-500/20",
        text: "text-slate-400",
        border: "border-slate-500/30",
        dot: "bg-slate-400",
      };
  }
}

export function getStatusBadgeStyle(status: TaskStatus): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  switch (status) {
    case "completed":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        label: "Completed",
      };
    case "in_progress":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/30",
        label: "In Progress",
      };
    case "pending":
    default:
      return {
        bg: "bg-slate-500/10",
        text: "text-slate-400",
        border: "border-slate-500/30",
        label: "Pending",
      };
  }
}

export function getCategoryBadgeStyle(category: TaskCategory): string {
  switch (category) {
    case "Work":
      return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    case "Personal":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "Health":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "Finance":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "Learning":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    case "Other":
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
}
