"use client";

import { useState, useEffect } from "react";

export default function FobReportCardForm({ fobReports }) {
  // 🔹 Today's date
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  // 🔹 Find if today's report already exists in props
  const existingReport = fobReports.find((r) => r.date === date);

  // 🔹 Form states
  const [monthlyUptoFOB, setMonthlyUptoFOB] = useState(
    existingReport?.monthlyUptoFOB || ""
  );
  const [yearlyUptoFOB, setYearlyUptoFOB] = useState(
    existingReport?.yearlyUptoFOB || ""
  );
  const [runday, setRunday] = useState(existingReport?.runday || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Track if there’s already an existing report
  const [hasExistingReport, setHasExistingReport] = useState(!!existingReport);

  // 🔹 Sync when existing report changes (e.g., on refresh)
  useEffect(() => {
    if (existingReport) {
      setMonthlyUptoFOB(existingReport.monthlyUptoFOB);
      setYearlyUptoFOB(existingReport.yearlyUptoFOB);
      setRunday(existingReport.runday);
      setHasExistingReport(true);
    }
  }, [existingReport]);

  // 🔹 Save new report
  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/fobreport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          monthlyUptoFOB,
          yearlyUptoFOB,
          runday,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Data saved successfully!");

        // 🟢 Mark as existing report immediately
        setHasExistingReport(true);
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to save data"}`);
      }
    } catch (error) {
      console.error("Save failed:", error);
      setMessage("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Edit existing report
  const handleEdit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/fobreport", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          monthlyUptoFOB,
          yearlyUptoFOB,
          runday,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Data updated successfully!");
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to update data"}`);
      }
    } catch (error) {
      console.error("Edit failed:", error);
      setMessage("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-black w-fit text-sm font-semibold p-3 space-y-2">
      {/* Date Input (disabled) */}
      <div className="flex border-b border-black">
        <div className="border-r border-black px-3 py-2">DATE:</div>
        <input
          type="date"
          value={date}
          disabled
          className="px-3 py-2 w-52 outline-none bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Monthly Upto FOB */}
      <div className="flex border-b border-black">
        <div className="border-r border-black px-3 py-2 w-40">
          Monthly Upto FOB:
        </div>
        <div className="flex items-center justify-between px-3 py-2 w-52">
          <span>$</span>
          <input
            type="number"
            step="0.01"
            value={monthlyUptoFOB}
            onChange={(e) => setMonthlyUptoFOB(e.target.value)}
            className="w-full text-right outline-none"
          />
        </div>
      </div>

      {/* Yearly Upto FOB */}
      <div className="flex border-b border-black">
        <div className="border-r border-black px-3 py-2 w-40">
          Yearly Upto FOB:
        </div>
        <div className="flex items-center justify-between px-3 py-2 w-52">
          <span>$</span>
          <input
            type="number"
            step="0.01"
            value={yearlyUptoFOB}
            onChange={(e) => setYearlyUptoFOB(e.target.value)}
            className="w-full text-right outline-none"
          />
        </div>
      </div>

      {/* Runday */}
      <div className="flex border-b border-black">
        <div className="border-r border-black px-3 py-2 w-40">Runday:</div>
        <input
          type="number"
          value={runday}
          onChange={(e) => setRunday(e.target.value)}
          className="px-3 py-2 w-52 outline-none"
          placeholder="0"
        />
      </div>

      {/* Save or Edit Button */}
      <button
        onClick={hasExistingReport ? handleEdit : handleSave}
        disabled={loading}
        className={`mt-3 text-white px-4 py-2 rounded ${
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

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("✅")
              ? "text-green-600"
              : message.includes("❌")
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
