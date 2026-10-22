import { Request, Response } from "express";
import {
  createProductService,
  getAllProductService,
  getProductByIdService,
} from "./product.service";

// Create Product controller
// Create Product controller function
export const createProductController = async (req: Request, res: Response) => {
  try {
    const data = JSON.parse(req.body.data);

    const files = (req.files as Express.Multer.File[]) || [];

    const result = await createProductService(data, files);

    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to create product" });
  }
};

// Get all products controller function
export const getAllProductController = async (req: Request, res: Response) => {
  try {
    const { keyword = "", limit = 10, offset = 0, status, category, size } = req.query;
    
    const result = await getAllProductService(
      keyword as string,
      Number(limit),
      Number(offset),
      status as string,
      category as string,
      size as string
    );
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get all products" });
  }
};

// Get product by id controller function
export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getProductByIdService(id as string);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get product by id" });
  }
}
