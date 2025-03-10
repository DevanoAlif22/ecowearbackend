import express from "express";
import {
  registerController,
  loginController,
  getPartnerController,
  approvePartnerController,
} from "../controllers/authController.js";
import uploadRegister from "../middleware/registerMiddleware.js";
import userAdmin from "../middleware/adminMiddleware.js";
import userLogin from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/partner", userLogin, userAdmin, getPartnerController);
router.get(
  "/admin/partner/approve/:id",
  userLogin,
  userAdmin,
  approvePartnerController
);
router.post(
  "/register",
  uploadRegister.single("dokumen_pendukung"),
  registerController
);
router.post("/login", loginController);
export default router;
