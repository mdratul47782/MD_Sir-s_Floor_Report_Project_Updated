"use client";
import { useState, useEffect, useMemo } from "react";

export default function FloorTable({floorReports, fobReports, hourlyReports, users}) {
  const floors = ["A2", "B2", "A3", "B3", "A4", "B4", "A5", "K3", "SMD"];
  
  const initialDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dates.push(`${month}/${day}`);
    }
    return dates;
  }, []);

  const [dates, setDates] = useState(initialDates);
  const [data, setData] = useState(
    floors.map(() => ({
      regular: 0,
      mini: 0,
      short: 0,
      days: initialDates.map(() => 0)
    }))
  );
  const [hourlyData, setHourlyData] = useState({
    "12H": 0,
    "10H": 0,
    "8H": 0
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from reports - will auto-update when props change
  useEffect(() => {
    if (!floorReports || !hourlyReports) return;

    console.log("📦 Updating Floor Table Data at:", new Date().toLocaleTimeString());

    // Load hourly data for today
    const today = new Date().toISOString().split('T')[0];
    const todayHourlyReport = hourlyReports.find(report => report.date === today);
    
    if (todayHourlyReport && todayHourlyReport.data) {
      setHourlyData({
        "12H": todayHourlyReport.data["12H"] || 0,
        "10H": todayHourlyReport.data["10H"] || 0,
        "8H": todayHourlyReport.data["8H"] || 0
      });
    }

    // Load floor data
    const newData = floors.map((floor) => {
      const floorData = {
        regular: 0,
        mini: 0,
        short: 0,
        days: initialDates.map(() => 0)
      };

      initialDates.forEach((dateStr, dayIndex) => {
        const report = floorReports.find(r => r.date === dateStr);
        
        if (report && report.data) {
          const floorEntry = report.data.find(d => d.floor === floor);
          
          if (floorEntry) {
            if (dayIndex === initialDates.length - 1) {
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
  }, [floorReports, hourlyReports, initialDates]);

  const handleChange = (i, field, value) => {
    const newData = [...data];
    newData[i][field] = value;
    setData(newData);
  };

  const handleDayChange = (i, j, value) => {
    const newData = [...data];
    newData[i].days[j] = value;
    setData(newData);
  };

  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const totals = {
    regular: data.reduce((t, r) => t + Number(r.regular || 0), 0),
    mini: data.reduce((t, r) => t + Number(r.mini || 0), 0),
    short: data.reduce((t, r) => t + Number(r.short || 0), 0),
    days: dates.map((_, j) => data.reduce((t, r) => t + Number(r.days[j] || 0), 0))
  };
  const grandTotal = totals.regular + totals.mini + totals.short;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 rounded-3xl border border-blue-200/60 bg-gradient-to-b from-blue-50 to-blue-100 shadow-2xl overflow-x-auto">
      <table className="min-w-full border-collapse border border-blue-300 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-400 to-blue-500 text-white sticky top-0 z-10">
          <tr>
            <th className="border border-blue-300 px-3 py-3 text-sm font-semibold">Floor</th>
            <th className="border border-blue-300 px-3 py-3 text-sm font-semibold">Line (Regular)</th>
            <th className="border border-blue-300 px-3 py-3 text-sm font-semibold">Mini (10–15)</th>
            <th className="border border-blue-300 px-3 py-3 text-sm font-semibold">Short (20–30)</th>

            {dates.map((date, index) => (
              <th key={index} className="border border-blue-300 px-3 py-2 text-center bg-gradient-to-b from-blue-300 to-blue-200 text-gray-800">
                <div className="flex flex-col items-center justify-center space-y-1">
                  {index === dates.length - 1 && isLoaded ? (
                    <div className="flex flex-col items-center text-xs text-blue-900 font-semibold leading-tight">
                      <span>12H: {hourlyData["12H"]}</span>
                      <span>10H: {hourlyData["10H"]}</span>
                      <span>8H: {hourlyData["8H"]}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-xs text-blue-900 font-semibold leading-tight">
                      <span>12H:</span>
                      <span>10H:</span>
                      <span>8H:</span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className="w-16 mt-1 text-center border border-blue-300 rounded-md text-xs bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm"
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm text-gray-700">
          {floors.map((floor, i) => (
            <tr key={floor} className="even:bg-blue-50 odd:bg-white hover:bg-blue-100/70 transition-colors border-b border-blue-200">
              <td className="px-2 py-2 font-semibold text-gray-800 bg-gray-100 border border-blue-200">{floor}</td>

              {["regular", "mini", "short"].map((type) => (
                <td key={type} className="border border-blue-200">
                  <input
                    type="number"
                    className="w-20 text-center border-none bg-transparent focus:ring-1 focus:ring-blue-300 rounded-md outline-none"
                    value={data[i][type]}
                    onChange={(e) => handleChange(i, type, e.target.value)}
                  />
                </td>
              ))}

              {dates.map((_, j) => (
                <td key={j} className="border border-blue-200">
                  <input
                    type="number"
                    className="w-16 text-center border-none bg-transparent focus:ring-1 focus:ring-blue-300 rounded-md outline-none"
                    value={data[i].days[j]}
                    onChange={(e) => handleDayChange(i, j, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}

          <tr className="font-semibold bg-gradient-to-r from-green-100 to-green-200 text-gray-800 border-t-2 border-green-400">
            <td className="border border-green-300 py-2">TOTAL</td>
            <td className="border border-green-300">{totals.regular}</td>
            <td className="border border-green-300">{totals.mini}</td>
            <td className="border border-green-300">{totals.short}</td>
            {totals.days.map((v, i) => (
              <td key={i} className="border border-green-300 text-blue-800 font-bold">
                {v}
              </td>
            ))}
          </tr>

          <tr className="font-bold bg-gradient-to-r from-blue-500 to-green-400 text-white text-center">
            <td colSpan={dates.length + 4} className="py-3">
              GRAND TOTAL (Line + Mini + Short): <span className="text-yellow-200">{grandTotal}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}