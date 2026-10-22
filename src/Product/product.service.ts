import mongoose, { Types } from "mongoose";
import { Product, IProduct } from "./product.model";
import { Category } from "../Category/category.model";
import { SubCategory } from "../SubCategory/subCategory.model";
import { slugify } from "../utils/helper";
import { uploadToBunny } from "../utils/bunnyUploader";

// Create product service function
export const createProductService = async (
  data: Partial<IProduct>,
  files: Express.Multer.File[],
) => {
  const {
    name,
    slug,
    description,
    category,
    subCategory,
    fabric,
    careInstructions,
    sizeChart,
    specifications,
    isFeatured,
    newArrival,
    bestSeller,
    isVirtualTryOnEnabled,
    virtualTryOnAssetUrl,
    metaTitle,
    metaDescription,
    variants,
  } = data;

  // Generate slug if not provided
  const resolvedSlug = slug || slugify(name!);

  // Check duplicate product
  const existingProduct = await Product.findOne({
    $or: [{ slug: resolvedSlug }, { name }],
  });

  if (existingProduct) {
    throw new Error("Product already exists");
  }

  // Process variants and upload images
  const processedVariants = await Promise.all(
    (variants || []).map(async (variant, variantIndex) => {
      // Find files belonging to this variant
      const variantFiles = files.filter(
        (file) => file.fieldname === `variant-${variantIndex}`,
      );

      // Upload variant images to CDN
      const uploadedImages = await Promise.all(
        variantFiles.map(async (file) => {
          const uploadResponse = await uploadToBunny(
            file.path,
            file.filename,
            "product",
          );

          if (!uploadResponse) {
            throw new Error(
              `Product variant ${variantIndex + 1} image upload failed`,
            );
          }

          return {
            imageUrl: uploadResponse.url,
            imageFileId: uploadResponse.fileName,
          };
        }),
      );

      return {
        color: variant.color,
        defaultView: variant.defaultView,
        images: uploadedImages,
        options: variant.options,
      };
    }),
  );

  // Create product
  const product = new Product({
    name,
    slug: resolvedSlug,
    description,

    // Frontend currently sends one ID,
    // database stores it as an array.
    category: [category],
    subCategory: subCategory ? [subCategory] : [],

    fabric,
    careInstructions,
    sizeChart: sizeChart || undefined,
    specifications,

    isFeatured: isFeatured ?? false,
    newArrival: newArrival ?? false,
    bestSeller: bestSeller ?? false,

    isVirtualTryOnEnabled: isVirtualTryOnEnabled ?? false,
    virtualTryOnAssetUrl,

    metaTitle,
    metaDescription,

    status: "active",

    variants: processedVariants,
  });

  await product.save();

  return product;
};

// Get All Products service function
export const getAllProductService = async (
  keyword: string,
  limit: number,
  offset: number,
  status?: string,
  category?: string,
  size?: string,
) => {
  const query: Record<string, any> = {
    status: { $ne: "deleted" },
  };

  if (keyword?.trim()) {
    query.$or = [
      { name: { $regex: keyword.trim(), $options: "i" } },
      { slug: { $regex: keyword.trim(), $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (category) {
    query.category = category;
  }

  if (size) {
    query["variants.options.size"] = size;
  }

  const result = await Product.find(query)
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .populate("variants.color", "name hexCode")
    .populate("variants.options.size", "name")
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments(query);

  return { result, total };
};

// Get product by id service function
export const getProductByIdService = async (id: string) => {
  const product = await Product.findById(id)
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .populate("variants.color", "name hexCode")
    .populate("variants.options.size", "name")
    .lean();

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
