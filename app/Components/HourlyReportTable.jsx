"use client";
import { useState, useEffect } from "react";

export default function HourlyReportTable({ hourlyReports = [] }) {
  console.log("⏰ Hourly Reports:", hourlyReports);

  const rowsLabels = ["12H", "10H", "8H"];

  // 📅 Default to previous day's date (only as initial value)
  const getPreviousDay = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0]; // 👉 "YYYY-MM-DD"
  };

  const [date, setDate] = useState(getPreviousDay());
  const [data, setData] = useState({ "12H": "", "10H": "", "8H": "" });
  const [isExisting, setIsExisting] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔍 Whenever `date` changes, check if we already have a report for that date
  useEffect(() => {
    if (!hourlyReports?.length) return;

    const found = hourlyReports.find((r) => r.date === date);

    if (found) {
      // 🔹 Existing record for this date
      setIsExisting(true);
      setExistingId(found._id);
      setData(found.data || { "12H": "", "10H": "", "8H": "" });
    } else {
      // 🔹 No record for this date → reset to empty (new entry mode)
      setIsExisting(false);
      setExistingId(null);
      setData({ "12H": "", "10H": "", "8H": "" });
    }

    // Clear any status message when switching dates
    setMessage("");
  }, [hourlyReports, date]);

  // 🔄 Update a single field
  const handleChange = (label, value) => {
    setData((prev) => ({ ...prev, [label]: value }));
  };

  // ✅ SAVE new data
  const handleSave = async () => {
    if (!data["12H"] || !data["10H"] || !data["8H"]) {
      setMessage("⚠️ All fields are required!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/hourlyreport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, data }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("✅ Data saved successfully!");
        setIsExisting(true);
        setExistingId(result.report._id);
      } else {
        setMessage(`❌ Error: ${result.error || "Failed to save data"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ UPDATE existing data
  const handleEdit = async () => {
    if (!existingId) {
      setMessage("❌ No existing record found for this date.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/hourlyreport?id=${existingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("✅ Data updated successfully!");
      } else {
        setMessage(`❌ Error: ${result.error || "Update failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-black text-sm font-semibold w-fit p-3 space-y-2">
      {/* Date Selector */}
      <div className="flex border-b border-black mb-2">
        <div className="border-r border-black px-3 py-2">DATE:</div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)} // 🔹 User can now select date
          className="px-3 py-2 w-52 outline-none bg-gray-100"
        />
      </div>

      {/* Input Fields */}
      <div className="flex flex-col gap-1">
        {rowsLabels.map((label) => (
          <div
            key={label}
            className="flex border-b border-black box-border w-fit"
          >
            <div className="border-r border-black w-32 h-10 flex items-center justify-between px-2 box-border">
              <span>{label}:</span>
              <input
                type="number"
                value={data[label] ?? ""} // 🔹 Safe fallback
                onChange={(e) => handleChange(label, e.target.value)}
                className="w-20 text-center border-none outline-none"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Save/Edit Button */}
      <button
        onClick={isExisting ? handleEdit : handleSave}
        disabled={loading}
        className={`mt-3 px-4 py-1 rounded text-white ${
          isExisting
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : isExisting ? "Edit" : "Save"}
      </button>

      {/* Status Message */}
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("✅")
              ? "text-green-600"
              : message.includes("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
