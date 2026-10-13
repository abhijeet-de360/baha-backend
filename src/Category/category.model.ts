import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  slug: string;
  name: string;
  priority?: number;
  status: "active" | "inactive" | "deleted";
  image: string;
  imageFileId: string;
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
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
