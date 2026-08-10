import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  TaskStats,
} from "./types";

// Initial Demo Seed Tasks
const initialDemoTasks: Task[] = [
  {
    id: "task-1",
    title: "Design Docker Containerization Setup",
    description:
      "Create multi-stage Dockerfile and docker-compose.yml for high performance Next.js and PostgreSQL orchestration.",
    status: "completed",
    priority: "urgent",
    category: "Work",
    dueDate: "2026-08-12",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "task-2",
    title: "Configure GitHub Actions CI/CD Pipeline",
    description:
      "Automate linting, type-checking, component testing, and production build validation on push.",
    status: "in_progress",
    priority: "high",
    category: "Work",
    dueDate: "2026-08-15",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Implement REST API Endpoints with Route Handlers",
    description:
      "Build GET, POST, PATCH, DELETE endpoints with input validation and clean error messaging.",
    status: "completed",
    priority: "high",
    category: "Work",
    dueDate: "2026-08-11",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Review Supabase & PostgreSQL Connection Pooling",
    description:
      "Verify connection limits and fallback strategy for external database integration.",
    status: "pending",
    priority: "medium",
    category: "Finance",
    dueDate: "2026-08-20",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "task-5",
    title: "Weekly Fitness & Health Tracker",
    description:
      "Plan workout split and log nutrition metrics for upcoming marathon training.",
    status: "pending",
    priority: "low",
    category: "Health",
    dueDate: "2026-08-18",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Persistent runtime store for fallback mode
let memoryTasksStore: Task[] = [...initialDemoTasks];

// Initialize DB Clients if environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const pgPool = pgUrl ? new Pool({ connectionString: pgUrl }) : null;

/**
 * Filter and sort in-memory tasks
 */
function applyFiltersAndSort(tasks: Task[], filters?: TaskFilters): Task[] {
  if (!filters) return tasks;

  let result = [...tasks];

  // Search filter (title & description)
  if (filters.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    result = result.filter((t) => t.status === filters.status);
  }

  // Priority filter
  if (filters.priority && filters.priority !== "all") {
    result = result.filter((t) => t.priority === filters.priority);
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    result = result.filter((t) => t.category === filters.category);
  }

  // Sorting
  const sortBy = filters.sortBy || "createdAt";
  const order = filters.sortOrder === "asc" ? 1 : -1;

  const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };

  result.sort((a, b) => {
    if (sortBy === "priority") {
      return (priorityWeight[a.priority] - priorityWeight[b.priority]) * order;
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * order;
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title) * order;
    }
    // Default: createdAt
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
  });

  return result;
}

/**
 * DB Layer Interfaces
 */
export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  // 1. Supabase Client
  if (supabase) {
    try {
      let query = supabase.from("tasks").select("*");
      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters?.priority && filters.priority !== "all") {
        query = query.eq("priority", filters.priority);
      }
      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      const { data, error } = await query;
      if (!error && data) {
        return applyFiltersAndSort(data as Task[], filters);
      }
    } catch (e) {
      console.warn("Supabase query failed, using memory store:", e);
    }
  }

  // 2. PostgreSQL Pool
  if (pgPool) {
    try {
      const res = await pgPool.query("SELECT * FROM tasks ORDER BY created_at DESC");
      if (res.rows) {
        const tasks: Task[] = res.rows.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description || "",
          status: row.status,
          priority: row.priority,
          category: row.category,
          dueDate: row.due_date ? new Date(row.due_date).toISOString().split("T")[0] : null,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        return applyFiltersAndSort(tasks, filters);
      }
    } catch (e) {
      console.warn("Postgres pool query failed, using memory store:", e);
    }
  }

  // 3. Fallback Memory Store
  return applyFiltersAndSort(memoryTasksStore, filters);
}

export async function getTaskById(id: string): Promise<Task | null> {
  const tasks = await getTasks();
  return tasks.find((t) => t.id === id) || null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const newTask: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: input.title.trim(),
    description: (input.description || "").trim(),
    status: input.status || "pending",
    priority: input.priority || "medium",
    category: input.category || "Work",
    dueDate: input.dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from("tasks").insert([newTask]).select().single();
      if (!error && data) return data as Task;
    } catch (e) {
      console.warn("Supabase insert failed, using fallback:", e);
    }
  }

  if (pgPool) {
    try {
      const query = `
        INSERT INTO tasks (id, title, description, status, priority, category, due_date, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;
      const values = [
        newTask.id,
        newTask.title,
        newTask.description,
        newTask.status,
        newTask.priority,
        newTask.category,
        newTask.dueDate,
        newTask.createdAt,
        newTask.updatedAt,
      ];
      const res = await pgPool.query(query, values);
      if (res.rows[0]) return newTask;
    } catch (e) {
      console.warn("Postgres insert failed, using fallback:", e);
    }
  }

  memoryTasksStore = [newTask, ...memoryTasksStore];
  return newTask;
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput
): Promise<Task | null> {
  const existing = memoryTasksStore.find((t) => t.id === id);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({ ...input, updatedAt: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data as Task;
    } catch (e) {
      console.warn("Supabase update failed:", e);
    }
  }

  if (pgPool) {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (input.title !== undefined) {
        fields.push(`title = $${idx++}`);
        values.push(input.title);
      }
      if (input.description !== undefined) {
        fields.push(`description = $${idx++}`);
        values.push(input.description);
      }
      if (input.status !== undefined) {
        fields.push(`status = $${idx++}`);
        values.push(input.status);
      }
      if (input.priority !== undefined) {
        fields.push(`priority = $${idx++}`);
        values.push(input.priority);
      }
      if (input.category !== undefined) {
        fields.push(`category = $${idx++}`);
        values.push(input.category);
      }
      if (input.dueDate !== undefined) {
        fields.push(`due_date = $${idx++}`);
        values.push(input.dueDate);
      }

      fields.push(`updated_at = $${idx++}`);
      values.push(new Date().toISOString());

      values.push(id);
      const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`;
      const res = await pgPool.query(query, values);
      if (res.rows[0]) {
        const row = res.rows[0];
        return {
          id: row.id,
          title: row.title,
          description: row.description || "",
          status: row.status,
          priority: row.priority,
          category: row.category,
          dueDate: row.due_date ? new Date(row.due_date).toISOString().split("T")[0] : null,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }
    } catch (e) {
      console.warn("Postgres update failed:", e);
    }
  }

  // Fallback memory store update
  const index = memoryTasksStore.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: Task = {
    ...memoryTasksStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  memoryTasksStore[index] = updated;
  return updated;
}

export async function deleteTask(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete failed:", e);
    }
  }

  if (pgPool) {
    try {
      const res = await pgPool.query("DELETE FROM tasks WHERE id = $1", [id]);
      if (res.rowCount && res.rowCount > 0) return true;
    } catch (e) {
      console.warn("Postgres delete failed:", e);
    }
  }

  const initialLength = memoryTasksStore.length;
  memoryTasksStore = memoryTasksStore.filter((t) => t.id !== id);
  return memoryTasksStore.length < initialLength;
}

export async function seedTasks(): Promise<Task[]> {
  memoryTasksStore = [...initialDemoTasks];
  return memoryTasksStore;
}

export async function getTaskStats(): Promise<TaskStats> {
  const tasks = await getTasks();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const highPriority = tasks.filter(
    (t) => t.priority === "high" || t.priority === "urgent"
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    inProgress,
    highPriority,
    completionRate,
  };
}
