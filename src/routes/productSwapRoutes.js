import express from "express";
import {
  getController,
  getByIdController,
  getByCategoryAllController,
  getByCategoryListController,
  createProductController,
  deleteByIdController,
  updateProductController,
  deleteGalleryByIdController,
  createGalleryProductController,
  createCommentController,
  deleteCommentByIdController,
  getListController,
  getByPartnerController,
  getByUserController,
  approveCommentController,
  testimonyPartnerController,
  testimonyUserController,
  getCommentByuserController,
} from "../controllers/productSwapController.js";
import uploadProduct from "../middleware/uploadProductSwapMiddleware.js";
import uploadCommentProduct from "../middleware/commentProductSwapMiddleware.js";
import testimonyProduct from "../middleware/testimonySwapMiddleware.js";
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
router.delete("/:id", userLogin, userPartner, deleteByIdController);
router.delete(
  "/gallery/:id",
  userLogin,
  userPartner,
  uploadProduct.array("gambar", 10),
  deleteGalleryByIdController
);
router.get("/all/:id", getByCategoryAllController);
router.get("/list/:id", getByCategoryListController);
router.post(
  "/create",
  userLogin,
  userPartner,
  uploadProduct.array("gambar", 10),
  createProductController
);
router.post(
  "/gallery/:id",
  userLogin,
  userPartner,
  uploadProduct.array("gambar", 10),
  createGalleryProductController
);
router.put(
  "/update/:id",
  userLogin,
  userPartner,
  uploadProduct.array("gambar", 10),
  updateProductController
);

// swap
router.post(
  "/partner/testimony/:id",
  userLogin,
  userPartner,
  testimonyProduct.single("gambar", 10),
  testimonyPartnerController
);

router.post(
  "/user/testimony/:id",
  userLogin,
  testimonyProduct.single("gambar", 10),
  testimonyUserController
);

// comment
router.get(
  "/comment/user/:id",
  userLogin,
  uploadProduct.array("gambar", 10),
  getCommentByuserController
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
