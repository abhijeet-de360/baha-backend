import { Category, ICategory } from "./category.model";
import { deletefromBunny, uploadToBunny } from "../utils/bunnyUploader";
import { slugify } from "../utils/helper";

// Create Category service function
export const createCategoryService = async (
  data: Partial<ICategory>,
  file: Express.Multer.File,
) => {
  const { name, slug, priority } = data;

  // Auto-generate slug from name if not provided
  const resolvedSlug = slug || slugify(name!);

  // Check for duplicate slug or name
  const existingCategory = await Category.findOne({
    $or: [{ slug: resolvedSlug }, { name }],
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const uploadResponse = await uploadToBunny(
    file.path,
    file.filename,
    "category",
  );

  if (!uploadResponse) {
    throw new Error("Category image upload failed");
  }

  const category = new Category({
    slug: resolvedSlug,
    name,
    image: uploadResponse.url,
    imageFileId: uploadResponse.fileName,
    priority: priority || 0,
  });

  await category.save();

  return category;
};

// Update Category service function
export const updateCategoryService = async (
  id: string,
  data: Partial<ICategory>,
  file?: Express.Multer.File,
) => {
  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    throw new Error("Category not found");
  }
  // If a new image file is provided, upload it and delete the old one
  if (file) {
    const uploadResponse = await uploadToBunny(
      file.path,
      file.filename,
      "category",
    );
    if (!uploadResponse) {
      throw new Error("Category image upload failed");
    }
    // Delete old image from BunnyCDN if it exists
    if (existingCategory.imageFileId) {
      await deletefromBunny(existingCategory.imageFileId, "category");
    }
    data.image = uploadResponse.url;
    data.imageFileId = uploadResponse.fileName;
  }
  const updatedCategory = await Category.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedCategory;
};

// Get all categories service function
export const getAllCategoriesService = async (
  keyword: string,
  limit: number,
  offset: number,
  status?: string,
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

  const result = await Category.find(query)
    .sort({ priority: 1, createdAt: -1 })
    .skip(offset)
    .limit(limit);
  const total = await Category.countDocuments(query);

  return {
    result,
    total,
  };
};

// Delete category service function
export const deleteCategoryService = async (id: string) => {
  const deletedCategory = await Category.findByIdAndUpdate(
    id,
    { status: "deleted" },
    {
      new: true,
    },
  );

  if (!deletedCategory) {
    throw new Error("Category not found");
  }

  return deletedCategory;
};
