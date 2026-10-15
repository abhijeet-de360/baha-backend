import { Router } from "express";
import {
  createProductController,
} from "./product.controller";
import { isAdmin } from "../middleware/isAdmin";

const productRouter = Router();


productRouter.post("/create", isAdmin, createProductController);


export default productRouter;
