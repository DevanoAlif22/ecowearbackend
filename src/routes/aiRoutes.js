import express from "express";
import { getPromptController } from "../controllers/aiController.js";

const router = express.Router();

router.post("/prompt", getPromptController);
export default router;
