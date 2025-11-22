"use client";
import { useState, useEffect, useCallback } from "react";
import VisualDashboardComponent from "@/app/Components/VisualDashboardComponent";
import BottomTable from "@/app/Components/BottomTable";

export default function DashboardDataProvider({ initialData }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Function to fetch fresh data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching fresh data at:", new Date().toLocaleTimeString());

      const response = await fetch("/api/dashboard-data", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const freshData = await response.json();
      setData(freshData);
      setLastUpdate(new Date());
      console.log("✅ Data refreshed successfully");
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div>
      {/* Optional: Show refresh indicator */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${loading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
        <span className="text-sm text-gray-700">
          {loading ? "Refreshing..." : `Last Update: ${lastUpdate.toLocaleTimeString()}`}
        </span>
      </div>

      <VisualDashboardComponent
        floorReports={data.floorReports}
        fobReports={data.fobReports}
        hourlyReports={data.hourlyReports}
        users={data.users}
      />
      <BottomTable
        floorReports={data.floorReports}
        fobReports={data.fobReports}
        hourlyReports={data.hourlyReports}
        users={data.users}
      />
    </div>
  );
}