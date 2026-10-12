import { SubCategory, ISubCategory } from "./subCategory.model";
import { deletefromBunny, uploadToBunny } from "../utils/bunnyUploader";
import { slugify } from "../utils/helper";
import { Category } from "../Category/category.model";

// Create sub category service function
export const createSubCategoryService = async (
  data: Partial<ISubCategory>,
  file: Express.Multer.File,
) => {
  const { name, slug, description, category, priority, status } = data;

  // auto generated slug from name if not provided
  const resolvedSlug = slug || slugify(name!);

  // Check if sub category with this slug already exists
  const slugExists = await SubCategory.exists({ slug: resolvedSlug });

  if (slugExists) {
    throw new Error("Slug already exists");
  }

  // Check if category is valid
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new Error("Category not found");
  }

  const uploadResponse = await uploadToBunny(
    file.path,
    file.filename,
    "subCategory",
  );

  if (!uploadResponse) {
    throw new Error("Image upload failed");
  }

  const subCategory = new SubCategory({
    name,
    slug: resolvedSlug,
    description,
    category,
    priority,
    status: status || "active",
    image: uploadResponse.url,
    imageFileId: uploadResponse.fileName,
    metaTitle: data.metaTitle || name,
    metaDescription: data.metaDescription || description,
  });

  await subCategory.save();

  return subCategory;
};

// Update sub category service function
export const updateSubCategoryService = async (
  id: string,
  data: Partial<ISubCategory>,
  file?: Express.Multer.File,
) => {
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    throw new Error("Sub category not found");
  }

  const { name, slug, description, category, priority, status } = data;

  const resolvedSlug = slug || slugify(name || subCategory.name);

  if (resolvedSlug !== subCategory.slug) {
    const slugExists = await SubCategory.exists({ slug: resolvedSlug });
    if (slugExists) {
      throw new Error("Slug already exists");
    }
  }

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  if (file) {
    // upload new image to bunny cdn
    const uploadResponse = await uploadToBunny(
      file.path,
      file.filename,
      "subCategory",
    );

    if (!uploadResponse) {
      throw new Error("Image upload failed");
    }

    // delete old image from bunny cdn
    await deletefromBunny(subCategory.imageFileId, "subCategory");
    subCategory.image = uploadResponse.url;
    subCategory.imageFileId = uploadResponse.fileName;
  }

  subCategory.name = name || subCategory.name;
  subCategory.slug = resolvedSlug;
  subCategory.description = description || subCategory.description;
  subCategory.category = category || subCategory.category;
  subCategory.priority = priority || subCategory.priority;
  subCategory.status = status || subCategory.status;
  subCategory.metaTitle = data.metaTitle || subCategory.metaTitle;
  subCategory.metaDescription =
    data.metaDescription || subCategory.metaDescription;

  await subCategory.save();

  return subCategory;
};

// Get all sub categories service function
export const getAllSubCategoriesService = async (
  keyword: string,
  limit: number,
  offset: number,
  status: string,
  categoryId?: string,
) => {
  const query: Record<string, any> = {};

  if (keyword?.trim()) {
    query.$or = [
      { name: { $regex: keyword.trim(), $options: "i" } },
      { slug: { $regex: keyword.trim(), $options: "i" } },
      { description: { $regex: keyword.trim(), $options: "i" } },
      { metaTitle: { $regex: keyword.trim(), $options: "i" } },
      { metaDescription: { $regex: keyword.trim(), $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (categoryId) {
    query.category = categoryId;
  }

  const result = await SubCategory.find(query)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("category", "name");

  const total = await SubCategory.countDocuments(query);

  return {
    result,
    total,
  };
};

// Delete sub category service function
export const deleteSubCategoryService = async (id: string) => {
  const deletedSubCategory = await SubCategory.findByIdAndUpdate(
    id,
    {
      status: "deleted",
    },
    { new: true },
  );

  if (!deletedSubCategory) {
    throw new Error("Sub category not found");
  }

  return deletedSubCategory;
};
