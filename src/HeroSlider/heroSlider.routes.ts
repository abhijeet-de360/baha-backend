import { Router } from "express";
import {
  createHeroSliderController,
  deleteHeroSliderController,
  getAllHeroSlidersController,
  getHeroSliderByIdController,
  updateHeroSliderController,
} from "./heroSlider.controller";
import { isAdmin } from "../middleware/isAdmin";
import { upload } from "../utils/multer";

const heroSliderRouter = Router();

heroSliderRouter.get("/list", getAllHeroSlidersController);

heroSliderRouter.post(
  "/create",
  isAdmin,
  upload.single("image"),
  createHeroSliderController,
);

heroSliderRouter.patch(
  "/update/:id",
  isAdmin,
  upload.single("image"),
  updateHeroSliderController,
);

heroSliderRouter.get("/:id", isAdmin, getHeroSliderByIdController);

heroSliderRouter.delete("/delete/:id", isAdmin, deleteHeroSliderController);

export default heroSliderRouter;
