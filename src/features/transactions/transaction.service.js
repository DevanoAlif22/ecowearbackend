import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

import { PENDING_PAYMENT } from "../../utils/constant.js";

const prisma = new PrismaClient();

class TransactionService {
  async createTransaction({
    transaction_id,
    total_harga,
    jumlah,
    alamat,
    id_produk,
    id_user,
    snap_token,
    snap_redirect_url,
  }) {
    return prisma.transaksi_produk.create({
      data: {
        total_harga: total_harga,
        jumlah: jumlah,
        alamat: alamat,
        status: PENDING_PAYMENT,
        id_produk,
        id_user,
        snap_token,
        snap_redirect_url,
      },
    });
  }

  // get all transactions
  async getTransactions({ status }) {
    let where = {};
    if (status) {
      where = {
        status,
      };
    }

    return prisma.transaksi_produk.findMany({
      where,
      include: {
        user: true,
        produk_jual: true,
      },
    });
  }

  // get transaction by id
  async getTransactionById({ transaction_id }) {
    return prisma.transaksi_produk.findUnique({
      where: {
        id: transaction_id,
      },
      include: {
        user: true,
        produk_jual: true,
      },
    });
  }

  // update transaction status
  async updateTransactionStatus({
    transaction_id,
    status,
    payment_method = null,
  }) {
    return prisma.transaksi_produk.update({
      where: {
        id: transaction_id,
      },
      data: {
        status,
        payment_method,
      },
    });
  }
}

export const transactionService = new TransactionService();
