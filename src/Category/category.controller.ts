import { Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  updateCategoryService,
} from "./category.service";

// Create Category controller function
export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      priority,
    } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const result = await createCategoryService(
      {
        name,
        slug,
        priority,
      },
      file,
    );

    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to create category" });
  }
};

// Update Category controller function
export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const {
      name,
      slug,
      priority,
      status
    } = req.body;

    const file = req.file;

    const result = await updateCategoryService(
      id,
      {
        name,
        slug,
        priority,
        status
      },
      file,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update category" });
  }
};

// Get all categories controller function
export const getAllCategoriesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { keyword = "", limit = 10, offset = 0, status } = req.query;
    const result = await getAllCategoriesService(
      keyword as string,
      Number(limit),
      Number(offset),
      status as string,
    );
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get all categories" });
  }
};

// Delete category controller function
export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await deleteCategoryService(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete category" });
  }
};
