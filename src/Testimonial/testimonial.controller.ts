import { Request, Response } from "express";
import {
  createTestimonialService,
  deleteTestimonialService,
  getAllTestimonialsService,
  updateTestimonialService,
} from "./testimonial.service";

// Create testimonial controller function
export const createTestimonialController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { customerName, customerRole, rating, status, review } = req.body;

    if (!customerName || !review) {
      return res
        .status(400)
        .json({ message: "Customer name and review are required" });
    }

    const file = req.file;

    const result = await createTestimonialService(
      {
        customerName,
        customerRole,
        rating,
        status,
        review,
      },
      file,
    );

    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to create testimonial" });
  }
};

// Update testimonial controller function
export const updateTestimonialController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);
    const { customerName, customerRole, rating, status, review } = req.body;

    const file = req.file;

    const result = await updateTestimonialService(
      id,
      {
        customerName,
        customerRole,
        rating,
        status,
        review,
      },
      file,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update testimonial" });
  }
};

// Get all testimonials controller function
export const getAllTestimonialsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getAllTestimonialsService();
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get all testimonials" });
  }
};

// Delete testimonial controller function
export const deleteTestimonialController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);
    const result = await deleteTestimonialService(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete testimonial" });
  }
};
