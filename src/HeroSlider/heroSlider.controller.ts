import { Request, Response } from "express";
import {
  createHeroSliderService,
  deleteHeroSliderService,
  getAllHeroSlidersService,
  getHeroSliderByIdService,
  updateHeroSliderService,
} from "./heroSlider.service";

// Create hero slider controller function
export const createHeroSliderController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      title,
      subTitle,
      buttonLabel,
      buttonLink,
      status,
      order,
      startDate,
      endDate,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await createHeroSliderService(
      {
        title,
        subTitle,
        buttonLabel,
        buttonLink,
        status,
        order,
        startDate,
        endDate,
      },
      file,
    );

    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to create hero slider" });
  }
};

// Get all hero sliders controller function
export const getAllHeroSlidersController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { keyword = "", limit = 10, offset = 0, status } = req.query;
    const result = await getAllHeroSlidersService(
      keyword as string,
      Number(limit),
      Number(offset),
      status as string,
    );
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get all hero sliders" });
  }
};

// Update hero slider controller function
export const updateHeroSliderController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);
    const {
      title,
      subTitle,
      image,
      buttonLabel,
      buttonLink,
      status,
      order,
      startDate,
      endDate,
    } = req.body;

    const file = req.file;

    const result = await updateHeroSliderService(
      id,
      {
        title,
        subTitle,
        image,
        buttonLabel,
        buttonLink,
        status,
        order,
        startDate,
        endDate,
      },
      file,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update hero slider" });
  }
};

// Get hero slider by id controller function
export const getHeroSliderByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);
    const result = await getHeroSliderByIdService(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get hero slider" });
  }
};

// Delete hero slider controller function
export const deleteHeroSliderController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);
    const result = await deleteHeroSliderService(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete hero slider" });
  }
};
