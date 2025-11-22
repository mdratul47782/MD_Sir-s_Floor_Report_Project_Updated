"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import FobReportCard from "./FobReportCard";
import HourlyReportTable from "./HourlyReportTable";
import ProductionInputTable from "./ProductionInputTable";

export default function DashboardClient({
  floorReports,
  fobReports,
  hourlyReports,
  users,
}) {
  const [dateTime, setDateTime] = useState(new Date());

  // Update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="min-h-screen p-12 bg-gray-50 relative">
      {/* Top Left Logo */}
      <div className="absolute top-6 left-11">
        <div className="p-2 rounded-2xl from-indigo-200 to-indigo-300 shadow-lg hover:shadow-indigo-400 transition duration-300">
          <Image
            src="/Screenshot_91.png"
            alt="HKD International (CEPZ) Ltd. Logo"
            width={200}
            height={80}
            className="rounded-xl object-contain transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>
      </div>

      {/* Visual Dashboard Button (Top Right) */}
      <div className="absolute top-6 right-11">
        <a
          href="/VisualDashboard"
          className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span>Visual Dashboard</span>
          </span>
        </a>
      </div>

      {/* 🕒 Modern Clock (Top Right)
      <div className="absolute top-8 right-12 bg-white/70 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/30 text-gray-800 text-center">
        <div className="text-lg font-semibold tracking-wider">
          {formattedDate}
        </div>
        <div className="text-3xl font-bold text-indigo-700 mt-1 animate-pulse">
          {formattedTime}
        </div>
      </div> */}

      {/* Main Dashboard Content */}
      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full max-w-7xl mt-24">
          {/* Top Row - Two Components Side by Side */}
          <div className="flex flex-col md:flex-row gap-2">
            <FobReportCard className="flex-1" fobReports={fobReports} />
            <HourlyReportTable
              className="flex-1"
              hourlyReports={hourlyReports}
            />
          </div>

          {/* Bottom Row - Full Width */}
          <div className="mt-4">
            <ProductionInputTable floorReports={floorReports} />
          </div>
        </div>
      </div>
    </div>
  );
}



