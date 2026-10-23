import mongoose, { Types } from "mongoose";
import { Product, IProduct, IProductVariant } from "./product.model";
import { Category } from "../Category/category.model";
import { SubCategory } from "../SubCategory/subCategory.model";
import { slugify } from "../utils/helper";
import { deletefromBunny, uploadToBunny } from "../utils/bunnyUploader";

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
    relatedProducts
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
    relatedProducts: relatedProducts ?? [],

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
    .populate("relatedProducts")
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
    .populate("relatedProducts")
    .lean();

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// Update product service function
export const updateProductService = async (
  id: string,
  data: Partial<IProduct>,
  files: Express.Multer.File[],
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  // Check duplicate slug
  if (data.slug && data.slug !== product.slug) {
    const existingProduct = await Product.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (existingProduct) {
      throw new Error("Product with this slug already exists");
    }
  }

  if (data.variants) {
    const processedVariants = await Promise.all(
      data.variants.map(async (variant, variantIndex) => {
        const existingVariant = variant._id
          ? product.variants.find(
              (item) => item._id?.toString() === variant._id?.toString(),
            )
          : undefined;

        const existingImages = variant.images || [];

        // ─────────────────────────────────────────────
        // Delete removed images from Bunny
        // ─────────────────────────────────────────────

        if (existingVariant) {
          const oldImages = existingVariant.images || [];

          const imagesToDelete = oldImages.filter(
            (oldImage) =>
              !existingImages.some(
                (newImage) => newImage.imageFileId === oldImage.imageFileId,
              ),
          );

          await Promise.all(
            imagesToDelete.map(async (image) => {
              await deletefromBunny(image.imageFileId, "product");
            }),
          );
        }

        // ─────────────────────────────────────────────
        // Upload new images
        // ─────────────────────────────────────────────

        const variantFiles = files.filter(
          (file) => file.fieldname === `variant-${variantIndex}`,
        );

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
          ...(existingVariant?._id ? { _id: existingVariant._id } : {}),

          color: variant.color,

          defaultView: variant.defaultView,

          images: [
            ...existingImages.map((image) => ({
              imageUrl: image.imageUrl,
              imageFileId: image.imageFileId,
            })),
            ...uploadedImages,
          ],

          options: variant.options.map((option) => ({
            ...(option._id ? { _id: option._id } : {}),

            sku: option.sku,
            size: option.size,
            stock: Number(option.stock),
            isAvailable: option.isAvailable,
            price: Number(option.price),

            discountPrice:
              option.discountPrice !== undefined &&
              option.discountPrice !== null
                ? Number(option.discountPrice)
                : undefined,
          })),
        };
      }),
    );

    data.variants = processedVariants as IProductVariant[];
  }

  // ─────────────────────────────────────────────
  // Update product
  // ─────────────────────────────────────────────

  Object.assign(product, {
    ...data,

    category: data.category ?? product.category,

    subCategory: data.subCategory ?? product.subCategory,

    sizeChart:
      data.sizeChart !== undefined
        ? data.sizeChart || undefined
        : product.sizeChart,
  });

  await product.save();

  return product;
};

// Delete product service function
export const deleteProductService = async (id: string) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { status: "deleted" },
    { new: true },
  );
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};
