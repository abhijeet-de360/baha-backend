import { SubCategory, ISubCategory } from "./subCategory.model";
import { slugify } from "../utils/helper";
import { Category } from "../Category/category.model";

// Create sub category service function
export const createSubCategoryService = async (
  data: Partial<ISubCategory>
) => {
  const { name, slug, category } = data;

  // auto generated slug from name if not provided
  const resolvedSlug = slug || slugify(name!);

  // Check if sub category with this slug already exists
  // const slugExists = await SubCategory.exists({ slug: resolvedSlug });

  // if (slugExists) {
  //   throw new Error("Slug already exists");
  // }

  // Check if category is valid
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new Error("Category not found");
  }

  const subCategory = new SubCategory({
    name,
    slug: resolvedSlug,
    category,
  });

  const subCategoryResult = await (await subCategory.save()).populate("category", "name");

  return subCategoryResult;
};

// Update sub category service function
export const updateSubCategoryService = async (
  id: string,
  data: Partial<ISubCategory>,
) => {
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    throw new Error("Sub category not found");
  }

  const { name, slug, category, status } = data;

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

  subCategory.name = name || subCategory.name;
  subCategory.slug = resolvedSlug;
  subCategory.category = category || subCategory.category;
  subCategory.status = status || subCategory.status;

  const subCategoryResult = await (await subCategory.save()).populate("category", "name");

  return subCategoryResult;
};

// Get all sub categories service function
export const getAllSubCategoriesService = async (
  keyword: string,
  limit: number,
  offset: number,
  status: string,
  categoryId?: string,
) => {
  const query: Record<string, any> = {
    status: { $ne: "deleted" }
  };

  if (keyword?.trim()) {
    query.$or = [
      { name: { $regex: keyword.trim(), $options: "i" } },
      { slug: { $regex: keyword.trim(), $options: "i" } },
    ];
  }

  if (status && status !== "all") {
    query.status = status;
  }

  if (categoryId && categoryId !== "all") {
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
