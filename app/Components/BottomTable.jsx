"use client";
import { useState, useEffect, useMemo } from "react";

export default function FloorTable({ floorReports, fobReports, hourlyReports, users }) {
  const floors = ["A2", "B2", "A3", "B3", "A4", "B4", "A5", "K3", "SMD"];

  // Generate last 10 days
  const initialDates = useMemo(() => {
    const dates = [];
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dates.push(`${month}/${day}`);
    }
    return dates;
  }, []);

  // Generate full date strings for matching with reports
  const fullDates = useMemo(() => {
    const dates = [];
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  }, []);

  const [dates] = useState(initialDates);
  const [data, setData] = useState(
    floors.map(() => ({
      regular: 0,
      mini: 0,
      short: 0,
      days: initialDates.map(() => 0),
    }))
  );
  const [hourlyDataByDate, setHourlyDataByDate] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data
  useEffect(() => {
    if (!floorReports || !hourlyReports) return;

    // 🔹 Load hourly data for all dates
    const hourlyMap = {};
    fullDates.forEach((fullDate, index) => {
      const report = hourlyReports.find((r) => r.date === fullDate);
      if (report && report.data) {
        hourlyMap[index] = {
          "12H": report.data["12H"] || 0,
          "10H": report.data["10H"] || 0,
          "8H": report.data["8H"] || 0,
        };
      } else {
        hourlyMap[index] = {
          "12H": 0,
          "10H": 0,
          "8H": 0,
        };
      }
    });
    setHourlyDataByDate(hourlyMap);

    const newData = floors.map((floor) => {
      const floorData = {
        regular: 0,
        mini: 0,
        short: 0,
        days: initialDates.map(() => 0),
      };

      initialDates.forEach((dateStr, dayIndex) => {
        const report = floorReports.find((r) => r.date === dateStr);
        if (report && report.data) {
          const floorEntry = report.data.find((d) => d.floor === floor);
          if (floorEntry) {
            // 🔹 Show previous day's data (second to last date) in Regular/Mini/Short columns
            if (dayIndex === initialDates.length - 2) {
              floorData.regular = floorEntry.regular || 0;
              floorData.mini = floorEntry.mini || 0;
              floorData.short = floorEntry.short || 0;
            }
            floorData.days[dayIndex] = floorEntry.dayValue || 0;
          }
        }
      });

      return floorData;
    });

    setData(newData);
    setIsLoaded(true);
  }, [floorReports, hourlyReports, initialDates, fullDates, floors]);

  // Format numbers
  const formatNumber = (num) => new Intl.NumberFormat("en-US").format(num);
  const formatDollar = (num) => `$${new Intl.NumberFormat("en-US").format(num)}`;

  const totals = {
    regular: data.reduce((t, r) => t + Number(r.regular || 0), 0),
    mini: data.reduce((t, r) => t + Number(r.mini || 0), 0),
    short: data.reduce((t, r) => t + Number(r.short || 0), 0),
    days: dates.map((_, j) => data.reduce((t, r) => t + Number(r.days[j] || 0), 0)),
  };
  const grandTotal = totals.regular + totals.mini + totals.short;

  return (
    <div className="w-full max-w-7xl mx-auto p-2 rounded-3xl border border-blue-200/60 bg-gradient-to-b from-blue-50 to-blue-100 shadow-2xl overflow-x-auto">
      <table className="min-w-full border-collapse border border-blue-300 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-400 to-blue-500 text-white sticky top-0 z-10">
          <tr>
            <th className="border border-blue-300 px-3 py-3 text-sm font-semibold">Floor</th>
            <th className="border border-blue-300 px-3 py-3 text-sm font-semibold">Line (Regular)</th>
            <th className="border border-blue-300 px-3 py-3 text-sm font-semibold">Mini (10–15)</th>
            <th className="border border-blue-300 px-3 py-3 text-sm font-semibold">Short (20–30)</th>

            {dates.map((date, index) => (
              <th
                key={index}
                className="border border-blue-300 px-3 py-2 text-center bg-gradient-to-b from-blue-300 to-blue-200 text-gray-800"
              >
                <div className="flex flex-col items-center justify-center space-y-1 border-4 border-blue-100 rounded-lg p-2 bg-blue-50 shadow-sm">
                  {/* 🔹 Show hourly data for each date */}
                  {isLoaded && hourlyDataByDate[index] ? (
                    <div className="flex flex-col items-center text-xs text-blue-900 font-semibold leading-tight">
                      <span>12H: {hourlyDataByDate[index]["12H"]}</span>
                      <span>10H: {hourlyDataByDate[index]["10H"]}</span>
                      <span>8H: {hourlyDataByDate[index]["8H"]}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-xs text-blue-900 font-semibold leading-tight">
                      <span>12H: 0</span>
                      <span>10H: 0</span>
                      <span>8H: 0</span>
                    </div>
                  )}
                  <div className="w-16 mt-1 text-center border border-blue-300 rounded-md text-xs bg-white/80 px-2 py-1 font-medium text-blue-900 font-semibold">
                    {date}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm text-gray-700">
          {floors.map((floor, i) => (
            <tr
              key={floor}
              className="even:bg-blue-50 odd:bg-white hover:bg-blue-100/70 transition-colors border-b border-blue-200"
            >
              <td className="px-2 py-2 font-semibold text-gray-800 bg-gray-100 border border-blue-200">
                {floor}
              </td>

              {/* Regular, Mini, Short — no $ sign */}
              {["regular", "mini", "short"].map((type) => (
                <td
                  key={type}
                  className="border border-blue-200 text-center font-bold text-blue-900"
                >
                  {formatNumber(data[i][type])}
                </td>
              ))}

              {/* Day values — with $ sign */}
              {dates.map((_, j) => (
                <td
                  key={j}
                  className="border border-blue-200 text-center font-bold text-blue-800"
                >
                  {formatDollar(data[i].days[j])}
                </td>
              ))}
            </tr>
          ))}

          {/* TOTAL ROW */}
          <tr className="font-semibold bg-gradient-to-r from-green-100 to-green-200 text-gray-800 border-t-2 border-green-400">
            <td className="border border-green-300 py-2">TOTAL</td>
            <td className="border border-green-300 font-bold text-green-900">
              {formatNumber(totals.regular)}
            </td>
            <td className="border border-green-300 font-bold text-green-900">
              {formatNumber(totals.mini)}
            </td>
            <td className="border border-green-300 font-bold text-green-900">
              {formatNumber(totals.short)}
            </td>
            {totals.days.map((v, i) => (
              <td
                key={i}
                className="border border-green-300 text-red-900 font-bold pl-10"
              >
                {formatDollar(v)}
              </td>
            ))}
          </tr>

          {/* GRAND TOTAL ROW */}
          <tr className="font-bold bg-gradient-to-r from-blue-400 to-blue-500 text-white">
            <td colSpan={4} className="py-3 text-center border border-blue-300 font-bold">
              GRAND TOTAL (Line + Mini + Short):{" "}
              <span className="text-white-600 font-extrabold">
                {formatNumber(grandTotal)}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}