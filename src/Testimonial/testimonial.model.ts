import mongoose, { Document, Schema } from "mongoose";

export interface ITestimonial extends Document {
  customerName: string;
  customerRole?: string;
  rating: number;
  status: "active" | "inactive" | "deleted";
  image?: string;
  imageFileId?: string;
  review: string;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerRole: {
      type: String,
      default: "Verified Customer",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
      required: true,
    },
    image: {
      type: String,
    },
    imageFileId: {
      type: String,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Testimonial = mongoose.model<ITestimonial>(
  "Testimonial",
  TestimonialSchema,
);
