import mongoose from "mongoose";

const FobReportSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    monthlyUptoFOB: { type: Number, required: true },
    yearlyUptoFOB: { type: Number, required: true },
    runday: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.FobReport ||
  mongoose.model("FobReport", FobReportSchema);
