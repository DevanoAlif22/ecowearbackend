import { PrismaClient } from "@prisma/client";
import { timeStamp } from "console";
const prisma = new PrismaClient();
import fs from "fs";

export const get = async () => {
  const products = await prisma.tukar_produk.findMany({
    orderBy: { id: "asc" },
    include: {
      komentar_produk_tukar: true,
      gallery_produk_tukar: true,
      kategori: true,
      penukaran_produk: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_tukar: true },
      },
    },
  });

  if (products === null) {
    return null;
  } else {
    return products;
  }
};

export const getByPartner = async (id) => {
  const products = await prisma.tukar_produk.findMany({
    where: { id_user: id },
    orderBy: { id: "asc" },
    include: {
      komentar_produk_tukar: true,
      gallery_produk_tukar: true,
      kategori: true,
      penukaran_produk: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_tukar: true },
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
  const products = await prisma.tukar_produk.findMany({
    where: { komentar_produk_tukar: { some: { id_user: id } } },
    orderBy: { id: "asc" },
    include: {
      komentar_produk_tukar: true,
      gallery_produk_tukar: true,
      kategori: true,
      penukaran_produk: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_tukar: true },
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
  const products = await prisma.tukar_produk.findMany({
    orderBy: { id: "asc" },
    take: 3,
    include: {
      komentar_produk_tukar: true,
      gallery_produk_tukar: true,
      kategori: true,
      penukaran_produk: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_tukar: true },
      },
    },
  });
  

  if (products === null) {
    return null;
  } else {
    return products;
  }
};

export const getById = async (id) => {
  const product = await prisma.tukar_produk.findUnique({
    where: { id },
    include: {
      komentar_produk_tukar: {
        select: {
          id: true,
          id_user: true,
          isi: true,
          tanggal_dibuat: true,
          gambar: true,
          alamat: true,
          is_approve: true,
          user: {
            select: {
              profil: true,
              nama: true,
            },
          },
        },
      },
      gallery_produk_tukar: true,
      kategori: true,
      penukaran_produk: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_tukar: true },
      },
    },
  });

  if (product === null) {
    console.log("Product not found");
    return null;
  } else {
    return product;
  }
};

export const getByCategoryAll = async (id) => {
  const product = await prisma.tukar_produk.findMany({
    where: { id_kategori: id },
    orderBy: { id: "asc" },
    include: {
      komentar_produk_tukar: true,
      gallery_produk_tukar: true,
      kategori: true,
      penukaran_produk: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_tukar: true },
      },
    },
  });

  if (product === null) {
    console.log("Product not found");
    return null;
  } else {
    return product;
  }
};
export const getByCategoryList = async (id) => {
  const product = await prisma.tukar_produk.findMany({
    where: { id_kategori: id },
    take: 3,
    orderBy: { id: "asc" },
    include: {
      komentar_produk_tukar: true,
      gallery_produk_tukar: true,
      kategori: true,
      penukaran_produk: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_tukar: true },
      },
    },
  });

  if (product === null) {
    console.log("Product not found");
    return null;
  } else {
    return product;
  }
};

export const updateProduct = async (data, id) => {
  return await prisma.tukar_produk.update({
    where: { id: id },
    data: {
      user: { connect: { id: parseInt(data.id_user, 10) } },
      nama: data.nama,
      deskripsi: data.deskripsi,
      kategori: { connect: { id: parseInt(data.id_kategori, 10) } },
      ukuran: data.ukuran,
    },
  });
};

export const createGallery = async (paths, is_png, id) => {
  for (let i = 0; i < paths.length; i++) {
    await prisma.gallery_produk_tukar.create({
      data: {
        path_file: paths[i],
        is_png: parseInt(is_png[i], 10) === 1 ? true : false,
        id_produk: id,
      },
    });
  }
};

export const deleteById = async (id, id_user) => {
  const gallery = await prisma.gallery_produk_tukar.findMany({
    where: { id_produk: id },
  });

  for (const file of gallery) {
    fs.unlinkSync(file.path_file);
  }

  await prisma.tukar_produk.delete({
    where: { id: id, id_user: id_user },
  });
};

export const createProduct = async (data) => {
  return await prisma.tukar_produk.create({ data });
};

export const deleteGalleryById = async (id_gallery, id_produk, id_user) => {
  const product = await prisma.tukar_produk.findFirst({
    where: { id: id_produk, id_user: id_user },
    include: {
      gallery_produk_tukar: {
        where: { id: id_gallery },
      },
    },
  });

  fs.unlinkSync(product.gallery_produk_tukar[0].path_file);
  await prisma.gallery_produk_tukar.delete({
    where: { id: id_gallery },
  });
};

export const addGallery = async (path, data, id) => {
  const product = await prisma.tukar_produk.findFirst({
    where: { id: parseInt(id, 10), id_user: parseInt(data.id_user, 10) },
  });
  await prisma.gallery_produk_tukar.create({
    data: {
      path_file: path[0],
      is_png: parseInt(data.is_png, 10) === 1 ? true : false,
      id_produk: id,
    },
  });
};

export const createComment = async (data) => {
  return await prisma.komentar_produk_tukar.create({
    data: {
      gambar: data.gambar,
      isi: data.isi,
      is_approve: false,
      alamat: data.alamat,
      tukar_produk: {
        connect: { id: data.id_produk },
      },
      user: {
        connect: { id: data.id_user },
      },
    },
  });
};

export const deleteCommentById = async (id_gallery, id_user) => {
  const comment = await prisma.komentar_produk_tukar.findFirst({
    where: { id: id_gallery, id_user: id_user },
    select: {
      gambar: true,
    },
  });

  fs.unlinkSync(comment.gambar);
  await prisma.komentar_produk_tukar.delete({
    where: { id: id_gallery },
  });
};

export const checkComment = async (id_comment, id_user) => {
  console.log(id_user);
  console.log(id_comment);
  return await prisma.komentar_produk_tukar.findFirst({
    where: { id: parseInt(id_comment, 10), id_user: parseInt(id_user, 10) },
    select: {
      gambar: true,
      id_produk: true,
    },
  });
};

export const approveComment = async (id_produk, id_comment, id_user) => {
  await prisma.komentar_produk_tukar.update({
    where: { id: parseInt(id_comment, 10), id_user: parseInt(id_user, 10) },
    data: {
      is_approve: true,
    },
  });

  await prisma.tukar_produk.update({
    where: {
      id: parseInt(id_produk, 10),
    },
    data: {
      status: "selesai",
    },
  });
  return await prisma.penukaran_produk.create({
    data: {
      id_tukar_produk: parseInt(id_produk, 10),
      id_komentar: parseInt(id_comment, 10),
      id_user: parseInt(id_user, 10),
      status: "proses",
    },
  });
};

export const testimonyPartner = async (id_penukaran, id_user, gambar) => {
  const produk = await prisma.penukaran_produk.update({
    where: {
      id: parseInt(id_penukaran, 10),
    },
    data: {
      bukti_pengiriman_mitra: gambar,
    },
  });

  await prisma.tukar_produk.update({
    where: {
      id: parseInt(produk.id_tukar_produk, 10),
    },
    data: {
      bukti_pengiriman_mitra: gambar,
    },
  });

  if (
    produk.bukti_pengiriman_user !== null ||
    produk.bukti_pengiriman_user !== ""
  ) {
    await prisma.penukaran_produk.update({
      where: {
        id: parseInt(id_penukaran, 10),
      },
      data: {
        status: "selesai",
      },
    });
  }
};

export const testimonyUser = async (id_penukaran, id_user, gambar) => {
  const produk = await prisma.penukaran_produk.update({
    where: {
      id: parseInt(id_penukaran, 10),
      id_user: parseInt(id_user, 10),
    },
    data: {
      bukti_pengiriman_user: gambar,
    },
  });

  if (
    produk.bukti_pengiriman_mitra !== null ||
    produk.bukti_pengiriman_mitra !== ""
  ) {
    await prisma.penukaran_produk.update({
      where: {
        id: parseInt(id_penukaran, 10),
        id_user: parseInt(id_user, 10),
      },
      data: {
        status: "selesai",
        tanggal_berhasil: new Date(),
      },
    });
  }
};

export const getCommentByUser = async (id) => {
  const comments = await prisma.komentar_produk_tukar.findMany({
    where: { id_user: id },
    orderBy: { id: "asc" },
    include: {
      tukar_produk: true,
      penukaran_produk: true,
    },
  });

  if (comments === null) {
    return null;
  } else {
    return comments;
  }
};
