import { NextResponse } from "next/server";
import { seedTasks } from "@/lib/db";

export async function POST() {
  try {
    const tasks = await seedTasks();
    return NextResponse.json({
      success: true,
      message: "Sample tasks seeded successfully",
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed tasks" },
      { status: 500 }
    );
  }
}
