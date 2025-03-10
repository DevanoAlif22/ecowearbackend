import express from "express";
import {
  getByIdController,
  getBodyByIdController,
  updateByIdController,
  getController,
} from "../controllers/profileUserController.js";
import userLogin from "../middleware/authMiddleware.js";
import userAdmin from "../middleware/adminMiddleware.js";
import uploadProfile from "../middleware/uploadProfileMiddleware.js";

const router = express.Router();

router.get("", userLogin, userAdmin, getController);
router.get("/:id", userLogin, getByIdController);
router.get("/body/:id", userLogin, getBodyByIdController);
router.put(
  "/:id",
  userLogin,
  uploadProfile.fields([
    { name: "profil", maxCount: 1 },
    { name: "badan", maxCount: 1 },
  ]),
  updateByIdController
);
export default router;
