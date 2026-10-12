import { Request, Response } from "express";
import {
  createSubCategoryService,
  deleteSubCategoryService,
  getAllSubCategoriesService,
  updateSubCategoryService,
} from "./subCategory.service";

// Create SubCategory controller function
export const createSubCategoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      priority,
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!name || !category) {
      return res.status(400).json({
        message: "Name and Category are required",
      });
    }

    const result = await createSubCategoryService(
      {
        name,
        slug,
        description,
        category,
        priority: priority ? Number(priority) : 0,
        status,
        metaTitle,
        metaDescription,
      },
      file,
    );

    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to create sub category" });
  }
};

// Update SubCategory controller function
export const updateSubCategoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);
    const {
      name,
      slug,
      description,
      category,
      priority,
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    const file = req.file;

    const result = await updateSubCategoryService(
      id,
      {
        name,
        slug,
        description,
        category,
        priority: priority !== undefined ? Number(priority) : undefined,
        status,
        metaTitle,
        metaDescription,
      },
      file,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update sub category" });
  }
};

// Get all SubCategories controller function
export const getAllSubCategoriesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      keyword = "",
      limit = 10,
      offset = 0,
      status = "",
      categoryId,
    } = req.query;

    const result = await getAllSubCategoriesService(
      keyword as string,
      Number(limit),
      Number(offset),
      status as string,
      categoryId as string | undefined,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get all sub categories" });
  }
};

// Delete SubCategory controller function
export const deleteSubCategoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);
    const result = await deleteSubCategoryService(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete sub category" });
  }
};
