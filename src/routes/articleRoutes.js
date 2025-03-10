import express from "express";
import {
  getArticlesController,
  getArticleByIdController,
  createArticleController,
  deleteArticleController,
  updateArticleController,
  getListArticleController,
} from "../controllers/articleController.js";
import uploadArticle from "../middleware/uploadArticleMiddleware.js";
import userAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("", getArticlesController);
router.get("/id/:id", getArticleByIdController);
router.get("/list", getListArticleController);
router.post(
  "/create",
  userAdmin,
  uploadArticle.single("gambar"),
  createArticleController
);
router.delete("/:id", userAdmin, deleteArticleController);
router.put("/:id", userAdmin, updateArticleController);
export default router;
