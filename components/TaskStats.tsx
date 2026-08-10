"use client";

import React from "react";
import { TaskStats as ITaskStats } from "@/lib/types";
import { CheckCircle2, Clock, ListTodo, AlertTriangle, TrendingUp } from "lucide-react";

interface TaskStatsProps {
  stats: ITaskStats;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks Card */}
        <div className="glass-card glass-card-hover p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Tasks
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                {stats.total}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 text-indigo-400 border border-slate-700/50">
              <ListTodo className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">{stats.total}</span> items in workspace
          </div>
        </div>

        {/* Pending & In Progress Card */}
        <div className="glass-card glass-card-hover p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                In Progress / Active
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                {stats.inProgress + stats.pending}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-blue-400 font-medium">{stats.inProgress} in progress</span>
            <span>•</span>
            <span className="text-slate-400">{stats.pending} pending</span>
          </div>
        </div>

        {/* Completed Card */}
        <div className="glass-card glass-card-hover p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Completed
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-emerald-400 sm:text-3xl">
                {stats.completed}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{stats.completionRate}% finish rate</span>
          </div>
        </div>

        {/* High Priority Card */}
        <div className="glass-card glass-card-hover p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                High Priority
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-amber-400 sm:text-3xl">
                {stats.highPriority}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-amber-400/90 font-medium">
            <span>Requires prompt focus</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">Overall Task Completion</span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-2/3">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-200 min-w-[45px] text-right">
            {stats.completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
