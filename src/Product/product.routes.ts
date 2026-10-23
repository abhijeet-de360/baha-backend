import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getProductByIdController,
  updateProductController,
} from "./product.controller";
import { isAdmin } from "../middleware/isAdmin";
import { upload } from "../utils/multer";

const productRouter = Router();

productRouter.get("/list", getAllProductController);
productRouter.post("/create", isAdmin, upload.any(), createProductController);
productRouter.get("/:id", getProductByIdController);
productRouter.patch("/update/:id", isAdmin, upload.any(), updateProductController);
productRouter.delete("/delete/:id", isAdmin, deleteProductController);

export default productRouter;
