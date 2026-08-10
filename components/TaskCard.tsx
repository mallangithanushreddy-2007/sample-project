"use client";

import React, { useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import {
  formatDate,
  isOverdue,
  getPriorityBadgeStyle,
  getStatusBadgeStyle,
  getCategoryBadgeStyle,
} from "@/lib/utils";
import {
  Calendar,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const priorityStyle = getPriorityBadgeStyle(task.priority);
  const statusStyle = getStatusBadgeStyle(task.status);
  const categoryStyle = getCategoryBadgeStyle(task.category);
  const overdue = isOverdue(task.dueDate, task.status);

  const isCompleted = task.status === "completed";

  return (
    <div
      className={`glass-card glass-card-hover p-5 flex flex-col justify-between relative group ${
        isCompleted ? "opacity-75 bg-slate-900/40" : ""
      }`}
    >
      <div className="space-y-3">
        {/* Top Badges & Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Tag */}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${categoryStyle}`}
            >
              {task.category}
            </span>

            {/* Priority Tag */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`} />
              {task.priority.toUpperCase()}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* Task Title & Complete Checkbox */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(task)}
            title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
              isCompleted
                ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                : "border-slate-700 bg-slate-950/80 hover:border-indigo-500"
            }`}
          >
            {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={`text-base font-bold text-slate-100 leading-snug tracking-tight transition-all ${
                isCompleted ? "line-through text-slate-400 font-normal" : ""
              }`}
            >
              {task.title}
            </h4>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <p
              className={`text-xs text-slate-400 leading-relaxed ${
                !isExpanded && task.description.length > 110 ? "line-clamp-2" : ""
              }`}
            >
              {task.description}
            </p>

            {task.description.length > 110 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Due Date & Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
        {/* Due Date & Overdue Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{formatDate(task.dueDate)}</span>

          {overdue && (
            <span className="flex items-center gap-1 text-rose-400 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              <AlertCircle className="h-3 w-3" /> Overdue
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:border-indigo-5 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:border-rose-500/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
