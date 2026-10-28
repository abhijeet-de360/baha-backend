import { Router } from "express";
import {
  createBlogController,
  deleteBlogController,
  getAllBlogsController,
  getBlogByIdController,
  getBlogBySlugController,
  updateBlogController,
} from "./blog.controller";
import { isAdmin } from "../middleware/isAdmin";
import { upload } from "../utils/multer";

const blogRouter = Router();

blogRouter.get("/list", getAllBlogsController);
blogRouter.get("/slug/:slug", getBlogBySlugController);
blogRouter.get("/:id", getBlogByIdController);

blogRouter.post(
  "/create",
  isAdmin,
  upload.single("image"),
  createBlogController,
);

blogRouter.patch(
  "/update/:id",
  isAdmin,
  upload.single("image"),
  updateBlogController,
);

blogRouter.delete("/delete/:id", isAdmin, deleteBlogController);

export default blogRouter;

