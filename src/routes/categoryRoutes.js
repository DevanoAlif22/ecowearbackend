import express from "express";
import {
  getCategoriesController,
  getCategoryByIdController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("", getCategoriesController);
router.get("/:id", getCategoryByIdController);
export default router;
