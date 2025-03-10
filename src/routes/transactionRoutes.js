import express from "express";
import {
  createTransaction,
  getTransactionById,
  getTransactions,
  updateTransactionStatus,
  trxNotif,
} from "../features/transactions/index.js";
import {
  validateTransaction,
  validateTransactionStatus,
} from "../features/transactions/transaction.validation.js";
import { catchAsync } from "../utils/catch-async.js";
import userLogin from "../middleware/authMiddleware.js";

const router = express.Router();

// transactions
router.post("", userLogin, validateTransaction, catchAsync(createTransaction));
router.post("/notification", userLogin, catchAsync(trxNotif));
router.get("", catchAsync(getTransactions));
router.get("/:transaction_id", catchAsync(getTransactionById));
router.put(
  "/:transaction_id",
  validateTransactionStatus,
  catchAsync(updateTransactionStatus)
);

export default router;
