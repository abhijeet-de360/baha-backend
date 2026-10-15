import { Request, Response } from "express";
import { createProductService } from "./product.service";

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
