import { NextRequest, NextResponse } from "next/server";
import { getTasks, createTask, getTaskStats } from "@/lib/db";
import { TaskFilters, CreateTaskInput } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: TaskFilters = {
      search: searchParams.get("search") || "",
      status: (searchParams.get("status") as any) || "all",
      priority: (searchParams.get("priority") as any) || "all",
      category: (searchParams.get("category") as any) || "all",
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
    };

    const tasks = await getTasks(filters);
    const stats = await getTaskStats();

    return NextResponse.json({
      success: true,
      data: tasks,
      stats,
      count: tasks.length,
    });
  } catch (error: any) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Task title is required" },
        { status: 400 }
      );
    }

    const input: CreateTaskInput = {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      category: body.category,
      dueDate: body.dueDate,
    };

    const newTask = await createTask(input);

    return NextResponse.json(
      {
        success: true,
        data: newTask,
        message: "Task created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}
