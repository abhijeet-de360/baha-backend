import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  slug: string;
  name: string;
  description?: string;
  priority?: number;
  status: "active" | "inactive" | "deleted";
  image: string;
  imageFileId: string;
  metaTitle: string;
  metaDescription: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    slug: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    image: {
      type: String,
      required: true,
    },
    imageFileId: {
      type: String,
    },
    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
