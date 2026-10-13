import mongoose, { Document, Schema, Types } from "mongoose";

// ─── Sub-document: Size Chart Row ─────────────────────────────────────────────
export interface ISizeChartRow {
  size: Types.ObjectId;
  height?: number;
  chest?: number;
  waist?: number;
}

const SizeChartRowSchema = new Schema<ISizeChartRow>(
  {
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    height: { type: Number, min: 0 },
    chest: { type: Number, min: 0 },
    waist: { type: Number, min: 0 },
  },
  { _id: false },
);

// ─── Main Interface ───────────────────────────────────────────────────────────
export interface ISizeChart extends Document {
  name: string;
  description?: string;
  rows: ISizeChartRow[];
  status: "active" | "inactive" | "deleted";
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
    },
    rows: {
      type: [SizeChartRowSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"] as const,
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
