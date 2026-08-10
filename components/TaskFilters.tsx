"use client";

import React from "react";
import { TaskFilters as ITaskFilters, TaskPriority, TaskStatus, TaskCategory } from "@/lib/types";
import { Search, X, Filter, ArrowUpDown, Tag, AlertCircle } from "lucide-react";

interface TaskFiltersProps {
  filters: ITaskFilters;
  onChange: (newFilters: ITaskFilters) => void;
  onReset: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (status: TaskStatus | "all") => {
    onChange({ ...filters, status });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, priority: e.target.value as TaskPriority | "all" });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, category: e.target.value as TaskCategory | "all" });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as any });
  };

  const toggleSortOrder = () => {
    onChange({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "all";

  return (
    <div className="glass-card p-5 mb-8 space-y-4">
      {/* Top row: Search input & Status tabs */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="task-search-input"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search tasks by title or description..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-950/60 p-1 border border-slate-800/80">
          {(["all", "pending", "in_progress", "completed"] as const).map(
            (statusKey) => {
              const isActive = filters.status === statusKey;
              const labels: Record<string, string> = {
                all: "All Tasks",
                pending: "Pending",
                in_progress: "In Progress",
                completed: "Completed",
              };
              return (
                <button
                  key={statusKey}
                  onClick={() => handleStatusChange(statusKey)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  {labels[statusKey]}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Bottom row: Dropdowns & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Select */}
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-slate-400" />
            <select
              value={filters.priority}
              onChange={handlePriorityChange}
              className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Category Select */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-slate-400" />
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="Learning">Learning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={handleSortByChange}
            className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={toggleSortOrder}
            title={`Sort Order: ${filters.sortOrder.toUpperCase()}`}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
