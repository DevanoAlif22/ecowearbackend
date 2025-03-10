import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";

export const get = async () => {
  const products = await prisma.produk_jual.findMany({
    orderBy: { id: "asc" },
    include: {
      komentar_produk: true,
      gallery_produk_jual: true,
      ukuran_produk: true,
      warna_produk: true,
      kategori: true,
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { transaksi_produk: true },
      },
    },
  });

  await prisma.$disconnect();

  if (products === null) {
    return null;
  } else {
    return products;
  }
};
export const getByPartner = async (id) => {
  const products = await prisma.produk_jual.findMany({
    where: { id_user: id },
    orderBy: { id: "asc" },
    include: {
      komentar_produk: true,
      gallery_produk_jual: true,
      ukuran_produk: true,
      warna_produk: true,
      kategori: true,
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { transaksi_produk: true },
      },
    },
  });

  if (products === null) {
    return null;
  } else {
    return products;
  }
};

export const getByUser = async (id) => {
  const products = await prisma.produk_jual.findMany({
    where: { komentar_produk: { some: { id_user: id } } },
    orderBy: { id: "asc" },
    include: {
      komentar_produk: true,
      gallery_produk_jual: true,
      ukuran_produk: true,
      warna_produk: true,
      kategori: true,
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { transaksi_produk: true },
      },
    },
  });

  if (products === null) {
    return null;
  } else {
    return products;
  }
};

export const getList = async () => {
  const products = await prisma.produk_jual.findMany({
    orderBy: { id: "asc" },
    take: 3,
    include: {
      komentar_produk: true,
      gallery_produk_jual: true,
      ukuran_produk: true,
      warna_produk: true,
      kategori: true,
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { transaksi_produk: true },
      },
    },
  });

  if (products === null) {
    return null;
  } else {
    return products;
  }
};

export const createGallery = async (paths, is_png, id) => {
  for (let i = 0; i < paths.length; i++) {
    await prisma.gallery_produk_jual.create({
      data: {
        path_file: paths[i],
        is_png: parseInt(is_png[i], 10) === 1 ? true : false,
        id_produk: id,
      },
    });
  }
};

export const deleteById = async (id, id_user) => {
  const gallery = await prisma.gallery_produk_jual.findMany({
    where: { id_produk: id },
  });

  for (const file of gallery) {
    fs.unlinkSync(file.path_file);
  }

  await prisma.produk_jual.delete({
    where: { id: id, id_user: id_user },
  });
};

export const createSize = async (sizes, id) => {
  for (const size of sizes) {
    await prisma.ukuran_produk.create({
      data: {
        nama: size,
        id_produk: id,
      },
    });
  }
};

export const createColor = async (colors, id) => {
  for (const color of colors) {
    await prisma.warna_produk.create({
      data: {
        nama: color,
        id_produk: id,
      },
    });
  }
};

export const createProduct = async (data) => {
  return await prisma.produk_jual.create({ data });
};

export const createTransaction = async (data) => {
  const jumlah = parseInt(data.jumlah);
  const id_produk = parseInt(data.id_produk);
  const produkJumlah = await prisma.produk_jual.findFirst({
    where: { id: id_produk },
    select: {
      jumlah: true,
    },
  });
  if (produkJumlah.jumlah - jumlah < 0) {
    return null;
  } else {
    return await prisma.transaksi_produk.create({ data });
  }
};

export const updateProduct = async (data, id) => {
  return await prisma.produk_jual.update({
    where: { id: id },
    data: {
      user: { connect: { id: parseInt(data.id_user, 10) } },
      nama: data.nama,
      deskripsi: data.deskripsi,
      kategori: { connect: { id: parseInt(data.id_kategori, 10) } },
      harga: data.harga,
      jumlah: data.jumlah,
    },
  });
};

export const updateColor = async (colors, id) => {
  // hapus semua color pada id_produk id dulu
  await prisma.warna_produk.deleteMany({
    where: { id_produk: id },
  });
  for (const color of colors) {
    await prisma.warna_produk.create({
      data: {
        nama: color,
        id_produk: id,
      },
    });
  }
};

export const updateSize = async (sizes, id) => {
  // hapus semua size pada id_produk id dulu
  await prisma.ukuran_produk.deleteMany({
    where: { id_produk: id },
  });
  for (const size of sizes) {
    await prisma.ukuran_produk.create({
      data: {
        nama: size,
        id_produk: id,
      },
    });
  }
};

export const getById = async (id) => {
  const product = await prisma.produk_jual.findUnique({
    where: { id },
    include: {
      komentar_produk: {
        select: {
          id: true,
          id_user: true,
          isi: true,
          tanggal_dibuat: true,
          user: {
            select: {
              profil: true,
              nama: true,
            },
          },
        },
      },
      gallery_produk_jual: true,
      ukuran_produk: true,
      warna_produk: true,
      kategori: true,
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { transaksi_produk: true },
      },
    },
  });

  if (product === null) {
    return null;
  } else {
    return product;
  }
};
export const getByCategoryAll = async (id) => {
  const product = await prisma.produk_jual.findMany({
    where: { id_kategori: id },
    orderBy: { id: "asc" },
    include: {
      komentar_produk: true,
      gallery_produk_jual: true,
      ukuran_produk: true,
      warna_produk: true,
      kategori: true,
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { transaksi_produk: true },
      },
    },
  });

  if (product === null) {
    return null;
  } else {
    return product;
  }
};
export const getByCategoryList = async (id) => {
  const product = await prisma.produk_jual.findMany({
    where: { id_kategori: id },
    orderBy: { id: "asc" },
    take: 3,
    include: {
      komentar_produk: true,
      gallery_produk_jual: true,
      ukuran_produk: true,
      warna_produk: true,
      kategori: true,
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { transaksi_produk: true },
      },
    },
  });

  if (product === null) {
    return null;
  } else {
    return product;
  }
};

export const deleteGalleryById = async (id_gallery, id_produk, id_user) => {
  // cari produk yang id nya id_produk, yang id_user nya id_user nanti include kan gallery_produk_jual nah di gallery itu cari yang id nya id_gallery
  const product = await prisma.produk_jual.findFirst({
    where: { id: id_produk, id_user: id_user },
    include: {
      gallery_produk_jual: {
        where: { id: id_gallery },
      },
    },
  });
  // ambil path nya, hapus gambar nya dulu terus hapus gallery_produk_jualnya
  fs.unlinkSync(product.gallery_produk_jual[0].path_file);
  await prisma.gallery_produk_jual.delete({
    where: { id: id_gallery },
  });
};
export const deleteCommentById = async (id_gallery, id_user) => {
  await prisma.komentar_produk.findFirst({
    where: { id: id_gallery, id_user: id_user },
  });

  await prisma.komentar_produk.delete({
    where: { id: id_gallery },
  });
};

export const addGallery = async (path, data, id) => {
  const product = await prisma.produk_jual.findFirst({
    where: { id: parseInt(id, 10), id_user: parseInt(data.id_user, 10) },
  });
  await prisma.gallery_produk_jual.create({
    data: {
      path_file: path[0],
      is_png: parseInt(data.is_png, 10) === 1 ? true : false,
      id_produk: id,
    },
  });
};

export const createComment = async (data) => {
  return await prisma.komentar_produk.create({ data });
};

export const testimonyAdmin = async (id_transaksi, gambar) => {
  const produk = await prisma.transaksi_produk.update({
    where: {
      id: parseInt(id_transaksi, 10),
    },
    data: {
      bukti_transfer_admin: gambar,
    },
  });
  return produk;
};

export const testimonyPartner = async (id_transaksi, id_user, gambar) => {
  const produk = await prisma.transaksi_produk.update({
    where: {
      id: parseInt(id_transaksi, 10),
    },
    data: {
      bukti_pengiriman_mitra: gambar,
    },
  });
  // if (
  //   produk.bukti_pengiriman_user !== null ||
  //   produk.bukti_pengiriman_user !== ""
  // ) {
  //   await prisma.transaksi_produk.update({
  //     where: {
  //       id: parseInt(id_transaksi, 10),
  //       id_user: parseInt(produk.id_user, 10),
  //     },
  //     data: {
  //       status: "selesai",
  //     },
  //   });
  // }
};

export const testimonyUser = async (id_transaksi, id_user, gambar) => {
  const produk = await prisma.transaksi_produk.update({
    where: {
      id: parseInt(id_transaksi, 10),
      id_user: parseInt(id_user, 10),
    },
    data: {
      bukti_pengiriman_user: gambar,
    },
  });

  // if (
  //   produk.bukti_pengiriman_mitra !== null ||
  //   produk.bukti_pengiriman_mitra !== ""
  // ) {
  //   await prisma.transaksi_produk.update({
  //     where: {
  //       id: parseInt(id_transaksi, 10),
  //       id_user: parseInt(id_user, 10),
  //     },
  //     data: {
  //       status: "selesai",
  //       tanggal_berhasil: new Date(),
  //     },
  //   });
  // }
};

export const getTransactionByUser = async (id) => {
  const transactions = await prisma.transaksi_produk.findMany({
    where: { id_user: id },
    orderBy: { id: "asc" },
    include: {
      produk_jual: true,
    },
  });

  if (transactions === null) {
    return null;
  } else {
    return transactions;
  }
};
export const getTransactionByPartner = async (id) => {
  console.log("halo");

  const transactions = await prisma.transaksi_produk.findMany({
    where: {
      produk_jual: {
        is: { id_user: parseInt(id, 10) }, // Perbaiki dari "some" menjadi "is"
      },
    },
    orderBy: {
      id: "desc",
    },
    include: {
      produk_jual: {
        include: {
          user: true, // Pastikan user ikut dimuat dalam produk_jual
        },
      },
    },
  });

  console.log("halo2");
  return transactions;
};

export const getTransactionByAdmin = async () => {
  const transactions = await prisma.transaksi_produk.findMany({
    include: {
      produk_jual: {
        include: {
          user: {
            select: {
              id: true,
              nama: true,
              nomor_rekening: true,
              nama_rekening: true,
            },
          }, // Memastikan user ikut dimuat dalam produk_jual
        },
      },
    },
  });

  if (transactions === null) {
    return null;
  } else {
    return transactions;
  }
};
