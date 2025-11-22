import Image from "next/image";
import LoginForm from "./components/auth/LoginForm";
import FloorReport from "@/app/models/FloorReport";
import FobReport from "@/app/models/FobReport";
import HourlyReport from "@/app/models/HourlyReport";
import { userModel } from "@/app/models/user-model";
import { dbConnect } from "@/app/service/mongo"; 

export default async function LoginPage() {
  // ✅ Connect to MongoDB
  await dbConnect();

  // // ✅ Fetch all data from collections
  // const floorReports = await FloorReport.find();
  // const fobReports = await FobReport.find();
  // const hourlyReports = await HourlyReport.find();
  // const users = await userModel.find();

  // // ✅ Log data to terminal (server console)
  // console.log("📦 Floor Reports:", floorReports);
  // console.log("🔑 Fob Reports:", fobReports);
  // console.log("⏰ Hourly Reports:", hourlyReports);
  // console.log("👤 Users:", users);

  // ✅ Render Login Page
  return (
    <section className="h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex items-center justify-center">
      <div className="max-w-[480px] w-full mx-auto p-10 bg-white rounded-3xl shadow-2xl border border-gray-100 transition-all duration-300 hover:shadow-indigo-300">
        {/* Company Details */}
        <div className="text-center mb-8">
          <div className="relative flex justify-center">
            <div className="p-2 rounded-2xl from-indigo-200 to-indigo-300 shadow-lg hover:shadow-indigo-400 transition duration-300">
              <Image
                src="/Screenshot_91.png"
                alt="HKD International (CEPZ) Ltd. Logo"
                width={320}
                height={120}
                className="mx-auto rounded-xl object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>

        {/* Login Form */}
        <h4 className="font-bold text-2xl mb-5 text-gray-800 text-center">
          Sign in to your account
        </h4>

        <LoginForm />

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} HKD Outdoor Innovations Ltd. <br />
          <span className="text-gray-500">All rights reserved.</span>
        </p>
      </div>
    </section>
  );
}
