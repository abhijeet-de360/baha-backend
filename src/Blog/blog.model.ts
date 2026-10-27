import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  status: "active" | "inactive" | "deleted";
  image?: string;
  imageFieldId?: string;
  imageFileId?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
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
    imageFieldId: {
      type: String,
    },
    imageFileId: {
      type: String,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model<IBlog>("Blog", BlogSchema);

