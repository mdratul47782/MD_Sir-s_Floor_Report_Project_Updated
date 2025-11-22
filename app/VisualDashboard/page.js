import FloorReport from "@/app/models/FloorReport";
import FobReport from "@/app/models/FobReport";
import HourlyReport from "@/app/models/HourlyReport";
import { userModel } from "@/app/models/user-model";
import { dbConnect } from "@/app/service/mongo";
import DashboardDataProvider from "@/app/Components/DashboardDataProvider";

export default async function VisualDashboard() {
  // ✅ Connect DB and fetch initial data
  await dbConnect();

  const floorReports = await FloorReport.find().lean();
  const fobReports = await FobReport.find().lean();
  const hourlyReports = await HourlyReport.find().lean();
  const users = await userModel.find().lean();

  const initialData = {
    floorReports: JSON.parse(JSON.stringify(floorReports)),
    fobReports: JSON.parse(JSON.stringify(fobReports)),
    hourlyReports: JSON.parse(JSON.stringify(hourlyReports)),
    users: JSON.parse(JSON.stringify(users)),
  };

  return <DashboardDataProvider initialData={initialData} />;
}
