import { Router } from "express";
import {
  createSizeChartController,
  deleteSizeChartController,
  getAllSizeChartsController,
  updateSizeChartController,
} from "./sizeChart.controller";
import { isAdmin } from "../middleware/isAdmin";

const sizeChartRouter = Router();

sizeChartRouter.get("/list", getAllSizeChartsController);
sizeChartRouter.post("/create", isAdmin, createSizeChartController);
sizeChartRouter.patch("/update/:id", isAdmin, updateSizeChartController);
sizeChartRouter.delete("/delete/:id", isAdmin, deleteSizeChartController);

export default sizeChartRouter;
