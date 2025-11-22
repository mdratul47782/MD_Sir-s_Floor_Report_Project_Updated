import mongoose from "mongoose";

const FloorSchema = new mongoose.Schema({
  floor: String,
  regular: Number,
  mini: Number,
  short: Number,
  dayValue: Number,
});

const FloorReportSchema = new mongoose.Schema(
  {
    date: String,
    data: [FloorSchema],
  },
  { timestamps: true }
);

export default mongoose.models.FloorReport ||
  mongoose.model("FloorReport", FloorReportSchema);
