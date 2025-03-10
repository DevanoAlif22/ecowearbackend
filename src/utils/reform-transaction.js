export const reformTransaction = (transaction) => {
  return {
    id: transaction.id,
    jumlah: transaction.jumlah,
    total_harga: transaction.total_harga,
    alamat: transaction.alamat,
    status: transaction.status,
    id_produk: transaction.id_produk,
    id_user: transaction.id_user,
    snap_token: transaction.snap_token,
    snap_redirect_url: transaction.snap_redirect_url,
    payment_method: transaction.payment_method,
  };
};
