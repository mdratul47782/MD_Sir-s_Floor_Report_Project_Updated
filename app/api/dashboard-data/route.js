import { NextResponse } from "next/server";
import FloorReport from "@/app/models/FloorReport";
import FobReport from "@/app/models/FobReport";
import HourlyReport from "@/app/models/HourlyReport";
import { userModel } from "@/app/models/user-model";
import { dbConnect } from "@/app/service/mongo";

export async function GET() {
  try {
    await dbConnect();

    const floorReports = await FloorReport.find().lean();
    const fobReports = await FobReport.find().lean();
    const hourlyReports = await HourlyReport.find().lean();
    const users = await userModel.find().lean();

    const data = {
      floorReports: JSON.parse(JSON.stringify(floorReports)),
      fobReports: JSON.parse(JSON.stringify(fobReports)),
      hourlyReports: JSON.parse(JSON.stringify(hourlyReports)),
      users: JSON.parse(JSON.stringify(users)),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}