import { NextRequest, NextResponse } from "next/server";
import { getTaskById, updateTask, deleteTask } from "@/lib/db";
import { UpdateTaskInput } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const task = await getTaskById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    console.error(`GET /api/tasks/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const input: UpdateTaskInput = {};
    if (body.title !== undefined) input.title = body.title;
    if (body.description !== undefined) input.description = body.description;
    if (body.status !== undefined) input.status = body.status;
    if (body.priority !== undefined) input.priority = body.priority;
    if (body.category !== undefined) input.category = body.category;
    if (body.dueDate !== undefined) input.dueDate = body.dueDate;

    const updatedTask = await updateTask(id, input);

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, error: "Task not found or could not be updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error: any) {
    console.error(`PATCH /api/tasks/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = await deleteTask(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Task not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error(`DELETE /api/tasks/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}
