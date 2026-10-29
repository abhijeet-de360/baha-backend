import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  type: "percentage" | "flat";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  timesUsed: number;
  validFrom: Date;
  validTill: Date;
  status: "active" | "expired" | "disabled" | "deleted";
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
      default: "percentage",
    },
    discountValue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    timesUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validTill: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "disabled", "deleted"],
      default: "active",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

CouponSchema.pre("save", function () {
  if (this.status !== "deleted" && this.status !== "disabled") {
    if (new Date(this.validTill) < new Date()) {
      this.status = "expired";
    }
  }
});

export const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);