import { dbConnect } from "@/app/service/mongo";
import FloorReport from "@/app/models/FloorReport";
import { NextResponse } from "next/server";

// 🔹 GET — Fetch all floor reports (for loading existing data)
export async function GET(req) {
  try {
    await dbConnect();
    const reports = await FloorReport.find({}).sort({ date: -1 }); // Sort by date descending
    
    return NextResponse.json(
      { reports },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 🔹 POST — Create new floor report
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { date, data } = body;

    if (!date || !data) {
      return NextResponse.json(
        { error: "Date and data are required" },
        { status: 400 }
      );
    }

    // 🟢 Check if report already exists for this date
    const existingReport = await FloorReport.findOne({ date });
    if (existingReport) {
      return NextResponse.json(
        { error: "Report for this date already exists. Use PATCH to update." },
        { status: 409 } // Conflict
      );
    }

    const report = new FloorReport({ date, data });
    await report.save();

    return NextResponse.json(
      { message: "Saved successfully", report },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 🔹 PATCH — Update existing floor report
export async function PATCH(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { date, data } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    const updated = await FloorReport.findOneAndUpdate(
      { date },
      { data, updatedAt: new Date() },
      { new: true, runValidators: true } // Run model validations
    );

    if (!updated) {
      return NextResponse.json(
        { error: "No record found for this date" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Updated successfully", updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 🔹 DELETE — Delete a floor report (optional, for admin use)
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const deleted = await FloorReport.findOneAndDelete({ date });

    if (!deleted) {
      return NextResponse.json(
        { error: "No record found for this date" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}