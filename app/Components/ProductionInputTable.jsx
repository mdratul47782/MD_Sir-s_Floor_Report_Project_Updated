"use client";
import { useState, useEffect } from "react";

// 🔹 Floors list (static)
const floors = ["A2", "B2", "A3", "B3", "A4", "B4", "A5", "K3", "SMD"];

// 🔹 Create an empty row set for all floors
const createEmptyData = () =>
  floors.map(() => ({
    regular: "",
    mini: "",
    short: "",
    dayValue: "",
  }));

// 🔹 Get yesterday as ISO string: "YYYY-MM-DD" (for <input type="date" />)
const getYesterdayISO = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split("T")[0];
};

// 🔹 Convert ISO date ("YYYY-MM-DD") → "M/D" (for DB storage & lookup)
const formatDateKey = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!month || !day) return isoDate;
  return `${Number(month)}/${Number(day)}`; // e.g. "11/21"
};

export default function FloorTable({ floorReports = [] }) {
  console.log("📦 Floor Reports:", floorReports);

  // 🔹 UI date uses ISO (for date picker: 2025-11-22)
  const [date, setDate] = useState(getYesterdayISO);

  // 🔹 Actual data rows
  const [data, setData] = useState(createEmptyData);

  // 🔹 Whether this date already has a report in DB
  const [hasExistingReport, setHasExistingReport] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔍 Whenever date or floorReports change, check if a report exists
  useEffect(() => {
    const dateKey = formatDateKey(date); // "MM/DD" for searching in floorReports

    const found = floorReports.find((r) => r.date === dateKey);

    if (found) {
      setData(found.data || createEmptyData());
      setHasExistingReport(true);
    } else {
      setData(createEmptyData());
      setHasExistingReport(false);
    }

    setMessage(""); // clear status when switching date
  }, [date, floorReports]);

  // 🔹 Handle cell change
  const handleChange = (i, field, value) => {
    const newData = [...data];
    newData[i][field] = value;
    setData(newData);
  };

  // Totals
  const totals = {
    regular: data.reduce((t, r) => t + Number(r.regular || 0), 0),
    mini: data.reduce((t, r) => t + Number(r.mini || 0), 0),
    short: data.reduce((t, r) => t + Number(r.short || 0), 0),
    dayValue: data.reduce((t, r) => t + Number(r.dayValue || 0), 0),
  };

  const grandTotal = totals.regular + totals.mini + totals.short;

  // 🔹 Format data before sending
  const formattedData = data.map((item, i) => ({
    floor: floors[i],
    regular: Number(item.regular) || 0,
    mini: Number(item.mini) || 0,
    short: Number(item.short) || 0,
    dayValue: Number(item.dayValue) || 0,
  }));

  // 🧾 Date string used for DB = "MM/DD"
  const dateKey = formatDateKey(date);

  // 🔹 Save new data (POST)
  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/floor-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateKey, data: formattedData }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Saved successfully!");
        setHasExistingReport(true);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save data!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Edit existing data (PATCH)
  const handleEdit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/floor-report", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateKey, data: formattedData }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Updated successfully!");
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 px-0 overflow-x-auto">
      <table className="border-collapse border border-gray-400 text-center">
        <thead>
          <tr className="bg-green-400 font-bold">
            <th colSpan={4} className="border border-gray-400 px-2 py-1 text-center">
              Floor Summary
            </th>
            <th className="border border-gray-400 px-2 py-1 text-center">
              Date
            </th>
          </tr>
          <tr className="bg-green-300">
            <th className="border border-gray-400 px-2 py-1">Floor</th>
            <th className="border border-gray-400 px-2 py-1">Line (Regular)</th>
            <th className="border border-gray-400 px-2 py-1">Mini (10–15)</th>
            <th className="border border-gray-400 px-2 py-1">Short (20–30)</th>
            <th className="border border-gray-400 px-2 py-1">
              {/* 🔹 User can now select date */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-32 text-center border-none outline-none bg-green-200"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          {floors.map((floor, i) => (
            <tr key={floor} className="border border-gray-400">
              <td className="border border-gray-400 px-2 py-1 font-semibold">{floor}</td>
              <td className="border border-gray-400">
                <input
                  type="number"
                  className="w-20 text-center border-none outline-none"
                  placeholder="0"
                  value={data[i]?.regular || ""}
                  onChange={(e) => handleChange(i, "regular", e.target.value)}
                />
              </td>
              <td className="border border-gray-400">
                <input
                  type="number"
                  className="w-20 text-center border-none outline-none"
                  placeholder="0"
                  value={data[i]?.mini || ""}
                  onChange={(e) => handleChange(i, "mini", e.target.value)}
                />
              </td>
              <td className="border border-gray-400">
                <input
                  type="number"
                  className="w-20 text-center border-none outline-none"
                  placeholder="0"
                  value={data[i]?.short || ""}
                  onChange={(e) => handleChange(i, "short", e.target.value)}
                />
              </td>
              <td className="border border-gray-400">
                <span>$</span>
                <input
                  type="number"
                  className="w-20 text-center border-none outline-none"
                  placeholder="0"
                  value={data[i]?.dayValue || ""}
                  onChange={(e) => handleChange(i, "dayValue", e.target.value)}
                />
              </td>
            </tr>
          ))}

          <tr className="font-bold bg-green-100">
            <td className="border border-gray-400">TOTAL</td>
            <td className="border border-gray-400">{totals.regular}</td>
            <td className="border border-gray-400">{totals.mini}</td>
            <td className="border border-gray-400">{totals.short}</td>
            <td className="border border-gray-400 text-red-600">
              <span>$ </span>
              {totals.dayValue}
            </td>
          </tr>

          <tr className="font-bold bg-green-300">
            <td colSpan={5} className="border border-gray-400 py-2">
              GRAND TOTAL (Line + Mini + Short): {grandTotal}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ✅ Save or Edit button */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={hasExistingReport ? handleEdit : handleSave}
          disabled={loading}
          className={`mt-1 text-white px-4 py-1 rounded ${
            hasExistingReport
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? hasExistingReport
              ? "Updating..."
              : "Saving..."
            : hasExistingReport
            ? "Edit"
            : "Save"}
        </button>

        {message && <span className="text-sm">{message}</span>}
      </div>
    </div>
  );
}
