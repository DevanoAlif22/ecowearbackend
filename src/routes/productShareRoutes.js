import express from "express";
import {
  getController,
  getByIdController,
  getByCategoryAllController,
  getByCategoryListController,
  createProductController,
  deleteByIdController,
  updateProductController,
  createCommentController,
  deleteCommentByIdController,
  approveCommentController,
  getListController,
  getByPartnerController,
  getByUserController,
  getCommentByUserController,
} from "../controllers/productShareController.js";
import uploadProduct from "../middleware/uploadProductShareMiddleware.js";
import uploadCommentProduct from "../middleware/commentProductShareMiddleware.js";
import userLogin from "../middleware/authMiddleware.js";
import userPartner from "../middleware/partnerMiddleware.js";

const router = express.Router();

// mitra
router.get("/partner/:id", userLogin, userPartner, getByPartnerController);

// user
router.get("/user/:id", userLogin, getByUserController);

router.get("", getController);
router.get("/list", getListController);
router.get("/:id", getByIdController);
router.delete("/:id", deleteByIdController);
router.get("/all/:id", getByCategoryAllController);
router.get("/list/:id", getByCategoryListController);
router.post(
  "/create",
  userLogin,
  userPartner,
  uploadProduct.single("gambar"),
  createProductController
);
router.put(
  "/update/:id",
  userLogin,
  userPartner,
  uploadProduct.single("gambar"),
  updateProductController
);
// comment
router.get(
  "/comment/user/:id",
  userLogin,
  uploadProduct.array("gambar", 10),
  getCommentByUserController
);
router.post(
  "/comment/approve/:id",
  userLogin,
  userPartner,
  uploadCommentProduct.single("gambar", 10),
  approveCommentController
);
router.post(
  "/comment/create",
  userLogin,
  uploadCommentProduct.single("gambar", 10),
  createCommentController
);
router.delete(
  "/comment/delete/:id",
  userLogin,
  uploadProduct.array("gambar", 10),
  deleteCommentByIdController
);
export default router;
