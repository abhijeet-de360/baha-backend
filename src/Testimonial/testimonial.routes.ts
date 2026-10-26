import { Router } from "express";
import {
  createTestimonialController,
  deleteTestimonialController,
  getAllTestimonialsController,
  updateTestimonialController,
} from "./testimonial.controller";
import { isAdmin } from "../middleware/isAdmin";
import { upload } from "../utils/multer";

const testimonialRouter = Router();

testimonialRouter.get("/list", getAllTestimonialsController);
testimonialRouter.post("/create", isAdmin, upload.single("image"), createTestimonialController);
testimonialRouter.patch("/update/:id", isAdmin, upload.single("image"), updateTestimonialController);
testimonialRouter.delete("/delete/:id", isAdmin, deleteTestimonialController);

export default testimonialRouter;
