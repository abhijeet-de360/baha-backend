import mongoose, { Document, Schema, Types } from "mongoose";

type Image = {
  imageUrl: string;
  imageFileId: string;
};

// ─── Sub-document: Product Variant ───────────────────────────────────────────
export interface IProductVariant {
  images: Image[];
  options: {
    sku: string;
    size: Types.ObjectId; // ref: Size
    stock: number;
    isAvailable: boolean;
    price: number;
    discountPrice: number;
  }[];
  color: Types.ObjectId; // ref: Color
  defaultView: boolean;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    color: {
      type: Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    images: [
      {
        imageUrl: {
          type: String,
          required: true,
        },
        imageFileId: {
          type: String,
          required: true,
        },
      },
    ],
    options: [
      {
        sku: {
          type: String,
          required: true,
          trim: true,
        },
        size: {
          type: Schema.Types.ObjectId,
          ref: "Size",
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        discountPrice: {
          type: Number,
          min: 0,
        },
      },
    ],
    defaultView: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

// ─── Main Interface ───────────────────────────────────────────────────────────
export interface IProduct extends Document {
  // Core info
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive" | "deleted";
  isFeatured: boolean;
  newArrival: boolean;
  bestSeller: boolean;

  // Categorisation
  category: Types.ObjectId; // ref: Category
  subCategory: Types.ObjectId; // ref: SubCategory

  // Variants by color
  variants: IProductVariant[];

  // Product details
  fabric?: string;
  careInstructions?: string;
  sizeChart?: Types.ObjectId; // ref: SizeChart
  specifications?: string;

  // Related products (manually configured by admin)
  relatedProducts: Types.ObjectId[]; // ref: Product

  // Virtual Try-On
  isVirtualTryOnEnabled: boolean;
  virtualTryOnAssetUrl?: string; // 3D model / AR asset URL

  // SEO / ratings
  metaTitle?: string;
  metaDescription?: string;
  averageRating: number;
  totalReviews: number;
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
const ProductSchema = new Schema<IProduct>(
  {
    // Core info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },

    // Categorisation
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    // Variants
    variants: {
      type: [ProductVariantSchema],
      default: [],
    },

    // Product details
    fabric: {
      type: String,
    },
    careInstructions: {
      type: String,
    },
    sizeChart: {
      type: Schema.Types.ObjectId,
      ref: "SizeChart",
    },

    // Extended specifications
    specifications: {
      type: String,
    },

    // Related products (manually set by admin)
    relatedProducts: {
      type: [Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },

    // Virtual Try-On
    isVirtualTryOnEnabled: {
      type: Boolean,
      default: false,
    },
    virtualTryOnAssetUrl: {
      type: String,
    },

    // SEO
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },

    // Ratings
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Model ────────────────────────────────────────────────────────────────────
export const Product = mongoose.model<IProduct>("Product", ProductSchema);
