"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

export default function DashboardPage({floorReports, fobReports, hourlyReports, users}) {
  const [dateTime, setDateTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    monthlyUptoFOB: 0,
    yearlyUptoFOB: 0,
    runday: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Memoize today's date to prevent hydration issues
  const todayDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data from fobReports - NOW UPDATES EVERY TIME fobReports CHANGES
  useEffect(() => {
    if (!fobReports || fobReports.length === 0) {
      setIsLoaded(true);
      return;
    }

    console.log("📊 Dashboard updating with new fobReports data");

    // Find today's report
    const todayReport = fobReports.find(report => report.date === todayDate);
    
    if (todayReport) {
      setDashboardData({
        monthlyUptoFOB: todayReport.monthlyUptoFOB || 0,
        yearlyUptoFOB: todayReport.yearlyUptoFOB || 0,
        runday: todayReport.runday || 0
      });
    } else {
      // If no report for today, try to get the most recent report
      const sortedReports = [...fobReports].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      if (sortedReports.length > 0) {
        const latestReport = sortedReports[0];
        setDashboardData({
          monthlyUptoFOB: latestReport.monthlyUptoFOB || 0,
          yearlyUptoFOB: latestReport.yearlyUptoFOB || 0,
          runday: latestReport.runday || 0
        });
      }
    }
    
    setIsLoaded(true);
  }, [fobReports, todayDate]); // This dependency is correct

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-6">
      {/* 🌿 Logo and Header */}
      <div className="w-full flex flex-col items-center justify-center text-center space-y-2 mb-6">
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/1630632533544-removebg-preview.png"
            alt="Company Logo"
            width={60}
            height={60}
            className="rounded-full shadow-md"
            priority
          />
          <h1 className="text-4xl font-bold text-blue-900 tracking-wide drop-shadow-sm">
            HKD Outdoor Innovations Ltd.
          </h1>
        </div>
        <h2 className="text-3xl font-semibold text-gray-900 relative inline-block px-3 py-2">
  📊 Visual Dashboard
  <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-full"></span>
</h2>

      </div>

      {/* 🔹 Info Cards (Equal Height & Width) */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly FOB */}
        <div className="flex flex-col items-center justify-center bg-white border border-blue-200 rounded-2xl shadow-md p-5 h-36">
          {/* <span className="text-blue-700 text-2xl">📅</span> */}
          <h3 className="font-semibold text-blue-900 text-lg mt-1">Monthly FOB</h3>
          <p className="font-bold text-blue-800 text-xl mt-2">
            {isLoaded ? formatCurrency(dashboardData.monthlyUptoFOB) : '$0'}
          </p>
        </div>

        {/* Yearly FOB */}
        <div className="flex flex-col items-center justify-center bg-white border border-green-200 rounded-2xl shadow-md p-5 h-36">
          {/* <span className="text-green-700 text-2xl">📈</span> */}
          <h3 className="font-semibold text-green-900 text-lg mt-1">Yearly FOB</h3>
          <p className="font-bold text-green-800 text-xl mt-2">
            {isLoaded ? formatCurrency(dashboardData.yearlyUptoFOB) : '$0'}
          </p>
        </div>

        {/* Run Day */}
        <div className="flex flex-col items-center justify-center bg-white border border-purple-200 rounded-2xl shadow-md p-5 h-36">
          {/* <span className="text-purple-700 text-2xl">🏃</span> */}
          <h3 className="font-semibold text-purple-900 text-lg mt-1">Run Day</h3>
          <p className="font-bold text-purple-800 text-xl mt-2">
            {isLoaded ? dashboardData.runday : 0}
          </p>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-2xl shadow-md p-5 h-36">
          {/* <span className="text-gray-700 text-2xl">⏰</span> */}
          <h3 className="font-semibold text-gray-900 text-lg mt-1">Date & Time</h3>
          <p className="font-bold text-gray-800 text-md mt-1">
            {dateTime.toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-sm">
            {dateTime.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}