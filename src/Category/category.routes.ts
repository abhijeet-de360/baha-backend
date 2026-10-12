import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "./category.controller";
import { isAdmin } from "../middleware/isAdmin";
import { upload } from "../utils/multer";

const categoryRouter = Router();

categoryRouter.get("/list", getAllCategoriesController);
categoryRouter.post("/create", isAdmin, upload.single("image"), createCategoryController);
categoryRouter.patch("/update/:id", isAdmin, upload.single("image"), updateCategoryController);
categoryRouter.delete("/delete/:id", isAdmin, deleteCategoryController);

export default categoryRouter;
