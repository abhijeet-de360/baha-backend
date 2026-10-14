import mongoose, { Document, Schema, Types } from "mongoose";

// ─── Sub-document: Size Chart Row ─────────────────────────────────────────────
export interface ISizeChartRow {
  size: Types.ObjectId;
  height?: { min: number; max: number };
  chest?: { min: number; max: number };
  waist?: { min: number; max: number };
}

const SizeChartRowSchema = new Schema<ISizeChartRow>(
  {
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    height: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
    },
    chest: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
    },
    waist: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
    },
  },
  { _id: false },
);

// ─── Main Interface ───────────────────────────────────────────────────────────
export interface ISizeChart extends Document {
  name: string;
  description?: string;
  rows: ISizeChartRow[];
  status: "active" | "deleted";
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
const SizeChartSchema = new Schema<ISizeChart>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    rows: {
      type: [SizeChartRowSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "deleted"] as const,
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// ─── Model ────────────────────────────────────────────────────────────────────
export const SizeChart = mongoose.model<ISizeChart>(
  "SizeChart",
  SizeChartSchema,
);
