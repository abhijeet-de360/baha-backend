import { Request, Response } from "express";
import {
  createSizeChartService,
  deleteSizeChartService,
  getAllSizeChartsService,
  updateSizeChartService,
} from "./sizeChart.service";

// Create Size Chart controller
export const createSizeChartController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { name, description, rows } = req.body;

    if (!name || !rows) {
      return res.status(400).json({ message: "Name and rows are required" });
    }

    const result = await createSizeChartService({
      name,
      description,
      rows,
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Failed to create size chart" });
  }
};

// Update size chart controller function
export const updateSizeChartController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { name, description, rows, status } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Size chart ID is required" });
    }

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    if (rows !== undefined && !Array.isArray(rows)) {
      return res.status(400).json({ message: "Rows must be an array" });
    }

    const result = await updateSizeChartService(id as string, {
      name: name?.trim(),
      description,
      rows,
      status,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Failed to update size chart" });
  }
};

// Get all Size Charts controller function
export const getAllSizeChartsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { keyword = "", offset = 0, limit = 10, status = "" } = req.query;

    const result = await getAllSizeChartsService(
      keyword as string,
      Number(offset),
      Number(limit),
      status as string,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch size charts" });
  }
};

// Delete Size Chart controller function
export const deleteSizeChartController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Size chart ID is required" });
    }

    const result = await deleteSizeChartService(id);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(404).json({
      message: error.message || "Failed to delete size chart",
    });
  }
};
