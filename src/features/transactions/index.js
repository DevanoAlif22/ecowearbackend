import { nanoid } from "nanoid";
import { getById } from "../../models/productSalesModel.js";
import { getByIdUser } from "../../models/authModel.js";
import { transactionService } from "./transaction.service.js";
import { reformTransaction } from "../../utils/reform-transaction.js";
import {
  CANCELED,
  MIDTRANS_SERVER_KEY,
  PENDING_PAYMENT,
  MIDTRANS_APP_URL,
  FRONT_END_URL,
} from "../../utils/constant.js";
import crypto from "crypto";

export const createTransaction = async (req, res) => {
  const { id_produk, id_user, jumlah, harga, alamat } = req.body;

  console.log("halo");

  const productsFromDB = await getById(parseInt(id_produk, 10));
  if (!productsFromDB) {
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Data Not Found" });
  }

  const user = await getByIdUser(parseInt(id_user, 10));
  const transaction_id = `TRX-${nanoid(4)}-${nanoid(8)}`;
  const total_harga = jumlah * harga;

  const authString = btoa(`${MIDTRANS_SERVER_KEY}`);
  const payload = {
    transaction_details: {
      order_id: transaction_id,
      gross_amount: total_harga,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: user.nama,
      last_name: "",
      email: user.email,
    },
    callback: {
      finish: `${FRONT_END_URL}/profile`,
      error: `${FRONT_END_URL}/profile`,
      pending: `${FRONT_END_URL}/profile`,
    },
  };

  const response = await fetch(`${MIDTRANS_APP_URL}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  console.log(response);

  const data = await response.json();
  if (response.status !== 201) {
    return res.status(500).json({
      status: "error",
      message: "failed to create transaction",
    });
  }

  await Promise.all([
    transactionService.createTransaction({
      transaction_id,
      total_harga,
      jumlah,
      alamat,
      id_produk,
      id_user,
      snap_token: data.token,
      snap_redirect_url: data.redirect_url,
    }),
  ]);

  console.log("sampai sini ga");
  res.json({
    status: "success",
    data: {
      id: transaction_id,
      status: PENDING_PAYMENT,
      id_produk,
      id_user,
      products: productsFromDB,
      snap_token: data.token,
      snap_redirect_url: data.redirect_url,
    },
  });
};

export const getTransactions = async (req, res) => {
  const { status } = req.query;
  const transactions = await transactionService.getTransactions({ status });

  res.json({
    status: "success",
    data: transactions.map((transaction) => reformTransaction(transaction)),
  });
};

export const getTransactionById = async (req, res) => {
  const { transaction_id } = req.params;
  const transaction = await transactionService.getTransactionById({
    transaction_id,
  });

  if (!transaction) {
    return res.status(404).json({
      status: "error",
      message: "Transaction not found",
    });
  }

  res.json({
    status: "success",
    data: reformTransaction(transaction),
  });
};

export const updateTransactionStatus = async (req, res) => {
  const { transaction_id } = req.params;
  const { status } = req.body;
  const transaction = await transactionService.updateTransactionStatus({
    transaction_id,
    status,
  });

  res.json({
    status: "success",
    data: transaction,
  });
};

const updateStatusBasedOnMidtransResponse = async (transaction_id, data) => {
  const hash = crypto
    .createHash("sha512")
    .update(
      `${transaction_id}${data.status_code}${data.gross_amount}${MIDTRANS_SERVER_KEY}`
    )
    .digest("hex");
  if (data.signature_key !== hash) {
    return {
      status: "error",
      message: "Invalid signature key",
    };
  }
  let responseData = null;
  let transactionStatus = data.transaction_status;
  let fraudStatus = data.fraud_status;

  if (transactionStatus == "capture") {
    if (fraudStatus == "accept") {
      const transaction = await transactionService.updateTransactionStatus({
        transaction_id,
        status: PAID,
        payment_method: data.payment_type,
      });
      responseData = transaction;
    }
  } else if (transactionStatus == "settlement") {
    const transaction = await transactionService.updateTransactionStatus({
      transaction_id,
      status: PAID,
      payment_method: data.payment_type,
    });
    responseData = transaction;
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    const transaction = await transactionService.updateTransactionStatus({
      transaction_id,
      status: CANCELED,
    });
    responseData = transaction;
  } else if (transactionStatus == "pending") {
    const transaction = await transactionService.updateTransactionStatus({
      transaction_id,
      status: PENDING_PAYMENT,
    });
    responseData = transaction;
  }

  return {
    status: "success",
    data: responseData,
  };
};
export const trxNotif = async (req, res) => {
  const data = req.body;
  transactionService
    .getTransactionById({ transaction_id: data.order_id })
    .then((transaction) => {
      if (transaction) {
        updateStatusBasedOnMidtransResponse(transaction.id, data).then(
          (result) => {
            console.log("result", result);
          }
        );
      }
    });
  res.status(200).json({
    status: "success",
    message: "OK",
  });
};
