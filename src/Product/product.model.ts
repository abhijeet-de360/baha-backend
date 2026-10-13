import mongoose, { Document, Schema, Types } from "mongoose";

type Image = {
  image: string;
  imageFileId: string;
};

// ─── Sub-document: Product Variant ───────────────────────────────────────────
export interface IProductVariant {
  sku: string;
  images: Image[];
  sizes: any; // ref: Size
  color: Types.ObjectId; // ref: Color
  defaultView: boolean;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    images: [
      {
        image: {
          type: String,
          required: true,
        },
        imageFileId: {
          type: String,
          required: true,
        },
      },
    ],
    sizes: [
      {
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
    }
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

  // Media              // primary/thumbnail image
  gallery: string[]; // additional images

  // Pricing
  price: number;
  discountPrice?: number;

  // Categorisation
  category: Types.ObjectId; // ref: Category
  subCategory: Types.ObjectId; // ref: SubCategory

  // Variants by color
  variants: IProductVariant[];

  // Product details
  fabric?: string;
  careInstructions?: string;
  ageSuitability?: string; // e.g. "0-3 months", "3-5 years"
  sizeChart?: string; // URL to size-chart image or doc
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
    ageSuitability: {
      type: String,
    },
    sizeChart: {
      type: String,
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
