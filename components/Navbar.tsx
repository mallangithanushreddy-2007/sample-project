"use client";

import React from "react";
import { CheckSquare, Plus, RefreshCw, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalTasksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
  totalTasksCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25">
              <CheckSquare className="h-6 w-6 text-white" />
              <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  TaskFlow<span className="text-indigo-400">.io</span>
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="h-3 w-3" /> Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Modern Task & Workflow Management System
              </p>
            </div>
          </div>

          {/* Quick Actions & Create Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Task Data"
              className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <RefreshCw
                className={`h-4 w-4 transition-transform duration-500 ${
                  isRefreshing ? "animate-spin text-indigo-400" : "group-hover:rotate-180"
                }`}
              />
            </button>

            <button
              onClick={onOpenCreateModal}
              id="new-task-btn"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
