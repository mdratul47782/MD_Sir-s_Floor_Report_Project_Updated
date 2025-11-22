import React from "react";
import DashboardClient from "../Components/DashboardClient";
import Image from "next/image";

import FloorReport from "@/app/models/FloorReport";
import FobReport from "@/app/models/FobReport";
import HourlyReport from "@/app/models/HourlyReport";
import { userModel } from "@/app/models/user-model";
import { dbConnect } from "@/app/service/mongo";

async function DashboardClientPage() {
  // ✅ Connect DB
  await dbConnect();

  // ✅ Fetch all data from collections
  const floorReports = await FloorReport.find().lean(); // 🔹 .lean() makes plain JS object
  const fobReports = await FobReport.find().lean();
  const hourlyReports = await HourlyReport.find().lean();
  const users = await userModel.find().lean();

  // ✅ Optional: Convert to safe JSON for passing to client
  const data = {
    floorReports: JSON.parse(JSON.stringify(floorReports)),
    fobReports: JSON.parse(JSON.stringify(fobReports)),
    hourlyReports: JSON.parse(JSON.stringify(hourlyReports)),
    users: JSON.parse(JSON.stringify(users)),
  };

  // ✅ Log data on server console
  // console.log("📦 Floor Reports:", data.floorReports);
  // console.log("🔑 Fob Reports:", data.fobReports);
  // console.log("⏰ Hourly Reports:", data.hourlyReports);
  // console.log("👤 Users:", data.users);

  return (
    <div>
      <DashboardClient
        floorReports={data.floorReports}
        fobReports={data.fobReports}
        hourlyReports={data.hourlyReports}
        users={data.users}
      />
    </div>
  );
}

export default DashboardClientPage;
