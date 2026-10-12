import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISubCategory extends Document {
  slug: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "deleted";
  image: string;
  imageFileId: string;
  category: Types.ObjectId;
  priority: number;
  metaTitle: string;
  metaDescription: string;
}

const SubCategorySchema = new Schema<ISubCategory>(
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
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    priority: {
      type: Number,
      default: 0,
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

export const SubCategory = mongoose.model<ISubCategory>(
  "SubCategory",
  SubCategorySchema,
);
