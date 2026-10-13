import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISubCategory extends Document {
  slug: string;
  name: string;
  status: "active" | "inactive" | "deleted";
  category: Types.ObjectId;
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
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
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
