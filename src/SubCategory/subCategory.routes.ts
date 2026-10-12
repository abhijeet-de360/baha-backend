import { Router } from "express";
import {
  createSubCategoryController,
  deleteSubCategoryController,
  getAllSubCategoriesController,
  updateSubCategoryController,
} from "./subCategory.controller";
import { isAdmin } from "../middleware/isAdmin";
import { upload } from "../utils/multer";

const subCategoryRouter = Router();

subCategoryRouter.get("/list", getAllSubCategoriesController);
subCategoryRouter.post(
  "/create",
  isAdmin,
  upload.single("image"),
  createSubCategoryController,
);
subCategoryRouter.patch(
  "/update/:id",
  isAdmin,
  upload.single("image"),
  updateSubCategoryController,
);
subCategoryRouter.delete("/delete/:id", isAdmin, deleteSubCategoryController);

export default subCategoryRouter;
