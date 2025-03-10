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
  createTransactionController,
  testimonyPartnerController,
  testimonyUserController,
  testimonyAdminController,
  getTransactionByUserController,
  getTransactionByAdminController,
  getTransactionByPartnerController,
} from "../controllers/productSalesController.js";
import uploadProduct from "../middleware/uploadProductSalesMiddleware.js";
import uploadTransaction from "../middleware/uploadTransactionMiddleware.js";
import testimonyProduct from "../middleware/testimonySwapMiddleware.js";
import userLogin from "../middleware/authMiddleware.js";
import userPartner from "../middleware/partnerMiddleware.js";
import userAdmin from "../middleware/adminMiddleware.js";

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
// transaction
router.get(
  "/transaction/admin",
  userAdmin,
  uploadTransaction.array("gambar", 10),
  getTransactionByAdminController
);
router.get(
  "/transaction/partner/:id",
  userPartner,
  uploadTransaction.array("gambar", 10),
  getTransactionByPartnerController
);
router.get(
  "/transaction/user/:id",
  userLogin,
  uploadTransaction.array("gambar", 10),
  getTransactionByUserController
);
router.post(
  "/transaction/:id",
  userLogin,
  uploadTransaction.array("gambar", 10),
  createTransactionController
);

router.post(
  "/partner/testimony/:id",
  userLogin,
  userPartner,
  testimonyProduct.single("gambar", 10),
  testimonyPartnerController
);

router.post(
  "/admin/testimony/:id",
  userLogin,
  userAdmin,
  testimonyProduct.single("gambar", 10),
  testimonyAdminController
);

router.post(
  "/user/testimony/:id",
  userLogin,
  testimonyProduct.single("gambar", 10),
  testimonyUserController
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
// comment
router.post(
  "/comment/create",
  userLogin,
  uploadProduct.array("gambar", 10),
  createCommentController
);
router.delete(
  "/comment/delete/:id",
  userLogin,
  uploadProduct.array("gambar", 10),
  deleteCommentByIdController
);
export default router;
