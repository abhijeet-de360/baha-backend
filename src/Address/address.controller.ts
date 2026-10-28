import { Request, Response } from "express";
import {
  createAddressService,
  deleteAddressService,
  getUserAddressesService,
  updateAddressService,
} from "./address.service";
import { UserRequest } from "../middleware/userId";

// Create address controller function
export const createAddressController = async (req: UserRequest, res: Response) => {
  try {
    const {
      user,
      addressType,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      isDefault,
    } = req.body;

    const resolvedUser = (req as any).userId || user;

    if (!resolvedUser) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!name || !phone || !addressLine1 || !city || !state || !pinCode) {
      return res.status(400).json({
        message:
          "Name, phone, addressLine1, city, state, and pinCode are required",
      });
    }

    const result = await createAddressService({
      user: resolvedUser,
      addressType,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      isDefault,
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to create address" });
  }
};

// Update address controller function
export const updateAddressController = async (req: UserRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const userId = req.userId;

    const {
      addressType,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      isDefault,
    } = req.body;

    const result = await updateAddressService(
      id,
      {
        addressType,
        name,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pinCode,
        isDefault,
      },
      userId,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update address" });
  }
};

// Get user addresses controller function
export const getUserAddressesController = async (
  req: UserRequest,
  res: Response,
) => {
  try {
    const userId = String(req.params.userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await getUserAddressesService(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get addresses" });
  }
};

// Delete address controller function
export const deleteAddressController = async (req: UserRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const userId = req.userId;

    const result = await deleteAddressService(id, userId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete address" });
  }
};
