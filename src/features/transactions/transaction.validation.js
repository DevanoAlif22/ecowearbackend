import { check } from "express-validator";
import { errorValidation } from "../../middleware/error-validation.js";
import { CANCELED, PAID, PENDING_PAYMENT } from "../../utils/constant.js";

export const validateTransactionStatus = [
  check("status")
    .isIn([PENDING_PAYMENT, PAID, CANCELED])
    .withMessage("Status must be one of PENDING_PAYMENT, PAID, CANCELED"),
  errorValidation,
];

// export const validateTransaction = [
//   check("products").isArray().withMessage("Products must be an array"),
//   check("products.*.id")
//     .isUUID()
//     .withMessage("Product id must be a valid UUID"),
//   check("products.*.quantity")
//     .isInt({ min: 1 })
//     .withMessage("Quantity must be at least 1"),
//   check("customer_name")
//     .isLength({ min: 3 })
//     .withMessage("Customer name must be at least 3 characters long"),
//   check("customer_email")
//     .isEmail()
//     .withMessage("Customer email must be a valid email"),
//   errorValidation,
// ];

export const validateTransaction = [
  check("id_produk").isInt().withMessage("Product ID must be a valid UUID"),
  check("id_user").isInt().withMessage("User ID must be a valid UUID"),
  check("jumlah").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  check("harga")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a valid number and at least 0"),
  check("alamat")
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
  errorValidation,
];
