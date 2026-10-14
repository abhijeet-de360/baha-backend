import mongoose, { Document, Schema, Types } from "mongoose";

// ─── Sub-document: Wishlist Item ──────────────────────────────────────────────
export interface IWishlistItem {
  product: Types.ObjectId; // ref: Product
  variantId?: Types.ObjectId;
  addedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

// ─── Main Interface ───────────────────────────────────────────────────────────
export interface IWishlist extends Document {
  user: Types.ObjectId; // ref: User
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [WishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// ─── Model ────────────────────────────────────────────────────────────────────
export const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
export default Wishlist;
