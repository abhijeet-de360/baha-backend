import { Request, Response } from "express";
import {
  createBlogService,
  deleteBlogService,
  getAllBlogsService,
  getBlogByIdService,
  getBlogBySlugService,
  updateBlogService,
} from "./blog.service";

// Create blog controller function
export const createBlogController = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, status, metaTitle, metaDescription } =
      req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const file = req.file;

    const result = await createBlogService(
      {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
      },
      file,
    );

    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to create blog" });
  }
};

// Update blog controller function
export const updateBlogController = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title, slug, content, status, metaTitle, metaDescription } =
      req.body;

    const file = req.file;

    const result = await updateBlogService(
      id,
      {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
      },
      file,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update blog" });
  }
};

// Get all blogs controller function
export const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const { keyword = "", offset = 0, limit = 10 } = req.query;

    const result = await getAllBlogsService(
      keyword as string,
      Number(offset),
      Number(limit),
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get all blogs" });
  }
};

// Get blog by ID controller function
export const getBlogByIdController = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await getBlogByIdService(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get blog" });
  }
};

// Get blog by slug controller function
export const getBlogBySlugController = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const result = await getBlogBySlugService(slug);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get blog" });
  }
};

// Delete blog controller function
export const deleteBlogController = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await deleteBlogService(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete blog" });
  }
};

