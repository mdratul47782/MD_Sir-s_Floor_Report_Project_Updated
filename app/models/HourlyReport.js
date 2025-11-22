import mongoose from "mongoose";

const HourlyReportSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    data: {
      type: Map,
      of: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HourlyReport ||
  mongoose.model("HourlyReport", HourlyReportSchema);
