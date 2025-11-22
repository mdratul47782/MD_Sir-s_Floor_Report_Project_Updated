import { dbConnect } from "@/app/service/mongo";
import HourlyReport from "@/app/models/HourlyReport";
import { NextResponse } from "next/server";

// ✅ POST (Create)
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { date, data } = body;

    if (!date || !data) {
      return NextResponse.json({ error: "Date and data required" }, { status: 400 });
    }

    const existing = await HourlyReport.findOne({ date });
    if (existing) {
      return NextResponse.json({ error: "Data for this date already exists" }, { status: 409 });
    }

    const report = new HourlyReport({ date, data });
    await report.save();

    return NextResponse.json({ message: "Saved successfully", report }, { status: 201 });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✏️ PATCH (Update)
export async function PATCH(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const { data } = body;

    if (!id || !data) {
      return NextResponse.json({ error: "ID and data required" }, { status: 400 });
    }

    const updated = await HourlyReport.findByIdAndUpdate(
      id,
      { data, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully", updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
