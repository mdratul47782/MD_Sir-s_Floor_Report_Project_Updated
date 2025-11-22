import FobReport from "@/app/models/FobReport";

import { dbConnect } from "@/app/service/mongo";

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { date, monthlyUptoFOB, yearlyUptoFOB, runday } = body;

    if (!date || !monthlyUptoFOB || !yearlyUptoFOB || !runday) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const report = new FobReport({
      date,
      monthlyUptoFOB,
      yearlyUptoFOB,
      runday,
    });

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
export async function PATCH(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { date, monthlyUptoFOB, yearlyUptoFOB, runday } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const updated = await FobReport.findOneAndUpdate(
      { date },
      { monthlyUptoFOB, yearlyUptoFOB, runday, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "No record found for this date" }, { status: 404 });
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
