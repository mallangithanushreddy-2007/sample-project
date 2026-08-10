export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskCategory = "Work" | "Personal" | "Health" | "Finance" | "Learning" | "Other";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string | null; // ISO date string (YYYY-MM-DD)
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  dueDate?: string | null;
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  category: TaskCategory | "all";
  sortBy: "createdAt" | "dueDate" | "priority" | "title";
  sortOrder: "asc" | "desc";
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  highPriority: number;
  completionRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
