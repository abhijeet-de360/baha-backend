import { Blog, IBlog } from "./blog.model";
import { deletefromBunny, uploadToBunny } from "../utils/bunnyUploader";
import { slugify } from "../utils/helper";

// Create blog service function
export const createBlogService = async (
  data: Partial<IBlog>,
  file?: Express.Multer.File,
) => {
  const { title, slug, content, metaTitle, metaDescription } = data;

  if (!title) {
    throw new Error("Blog title is required");
  }

  // Auto-generate slug from title if not provided
  const resolvedSlug = slug ? slugify(slug) : slugify(title);

  // Check for duplicate slug
  const existingBlog = await Blog.findOne({
    $or: [{ slug: resolvedSlug }, { title }],
  });

  if (existingBlog) {
    throw new Error("Blog with this title or slug already exists");
  }

  let uploadResponse;
  if (file) {
    uploadResponse = await uploadToBunny(file.path, file.filename, "blog");
    if (!uploadResponse) {
      throw new Error("Blog image upload failed");
    }
  }

  const blog = new Blog({
    title,
    slug: resolvedSlug,
    content,
    image: uploadResponse?.url || "",
    imageFileId: uploadResponse?.fileName || "",
    metaTitle,
    metaDescription,
  });

  await blog.save();
  return blog;
};

// Update blog service function
export const updateBlogService = async (
  id: string,
  data: Partial<IBlog>,
  file?: Express.Multer.File,
) => {
  const existingBlog = await Blog.findById(id);

  if (!existingBlog) {
    throw new Error("Blog not found");
  }

  // If title or slug is changed, validate slug uniqueness
  if (data.title || data.slug) {
    const resolvedSlug = data.slug
      ? slugify(data.slug)
      : data.title
      ? slugify(data.title)
      : existingBlog.slug;

    const duplicate = await Blog.findOne({
      _id: { $ne: id },
      slug: resolvedSlug,
    });

    if (duplicate) {
      throw new Error("Blog with this slug already exists");
    }

    data.slug = resolvedSlug;
  }

  // If a new image file is provided, upload it and delete the old one
  if (file) {
    const uploadResponse = await uploadToBunny(
      file.path,
      file.filename,
      "blog",
    );

    if (!uploadResponse) {
      throw new Error("Blog image upload failed");
    }

    const oldFileId = existingBlog.imageFileId;
    if (oldFileId) {
      await deletefromBunny(oldFileId, "blog");
    }

    data.image = uploadResponse.url;
    data.imageFileId = uploadResponse.fileName;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });

  if (!updatedBlog) {
    throw new Error("Blog not found");
  }

  return updatedBlog;
};

// Get all blogs service function
export const getAllBlogsService = async (
  keyword: string = "",
  offset: number = 0,
  limit: number = 10,
) => {
  const query: Record<string, any> = {
    status: { $ne: "deleted" },
  };

  if (keyword?.trim()) {
    query.$or = [
      { title: { $regex: keyword.trim(), $options: "i" } },
      { slug: { $regex: keyword.trim(), $options: "i" } },
    ];
  }

  const result = await Blog.find(query)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const total = await Blog.countDocuments(query);

  return {
    result,
    total,
  };
};

// Get blog by ID service function
export const getBlogByIdService = async (id: string) => {
  const blog = await Blog.findOne({ _id: id});

  if (!blog) {
    throw new Error("Blog not found");
  }

  return blog;
};

// Get blog by slug service function
export const getBlogBySlugService = async (slug: string) => {
  const blog = await Blog.findOne({ slug });

  if (!blog) {
    throw new Error("Blog not found");
  }

  return blog;
};

// Delete blog service function (hard delete)
export const deleteBlogService = async (id: string) => {
  const existingBlog = await Blog.findById(id);

  if (!existingBlog) {
    throw new Error("Blog not found");
  }

  if (existingBlog.imageFileId) {
    await deletefromBunny(existingBlog.imageFileId, "blog");
  }

  const deletedBlog = await Blog.findByIdAndDelete(id);

  return deletedBlog;
};

