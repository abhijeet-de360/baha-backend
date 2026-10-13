import { Router } from "express";
import {
  createSubCategoryController,
  deleteSubCategoryController,
  getAllSubCategoriesController,
  updateSubCategoryController,
} from "./subCategory.controller";
import { isAdmin } from "../middleware/isAdmin";

const subCategoryRouter = Router();

subCategoryRouter.get("/list", getAllSubCategoriesController);
subCategoryRouter.post("/create", isAdmin, createSubCategoryController);
subCategoryRouter.patch("/update/:id", isAdmin, updateSubCategoryController);
subCategoryRouter.delete("/delete/:id", isAdmin, deleteSubCategoryController);

export default subCategoryRouter;
