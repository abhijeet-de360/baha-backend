import mongoose, { Document, Schema } from "mongoose";

export interface IHeroSlider extends Document {
  title: string;
  subTitle?: string;
  image: string;
  imageFileId: string;
  buttonLabel?: string;
  buttonLink?: string;
  status: "active" | "inactive" | "deleted";
  order: number;
  startDate?: Date;
  endDate?: Date;
}

const HeroSliderSchema = new Schema<IHeroSlider>(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    imageFileId: {
      type: String,
    },
    buttonLabel: {
      type: String,
    },
    buttonLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    order: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const HeroSlider = mongoose.model<IHeroSlider>(
  "HeroSlider",
  HeroSliderSchema,
);
