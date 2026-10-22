import { Router } from "express";
import {
  createProductController,
  getAllProductController,
  getProductByIdController,
} from "./product.controller";
import { isAdmin } from "../middleware/isAdmin";
import { upload } from "../utils/multer";

const productRouter = Router();

productRouter.get("/list", getAllProductController);
productRouter.post("/create", isAdmin, upload.any(), createProductController);
productRouter.get("/:id", getProductByIdController);

export default productRouter;
