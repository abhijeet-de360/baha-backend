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
    status,
    variants,
  } = data;

  console.log("Data === > ", data);
  console.log("files ===> ", files);

  throw new Error("Something went wrong");

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

    status: status ?? "active",

    variants: processedVariants,
  });

  await product.save();

  return product;
};
