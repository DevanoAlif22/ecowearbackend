import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";

export const get = async () => {
  const products = await prisma.berbagi_produk.findMany({
    orderBy: { id: "desc" },
    include: {
      komentar_produk_berbagi: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_berbagi: true },
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
  const products = await prisma.berbagi_produk.findMany({
    where: { id_user: id },
    orderBy: { id: "desc" },
    include: {
      komentar_produk_berbagi: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_berbagi: true },
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
  const products = await prisma.berbagi_produk.findMany({
    where: { komentar_produk_berbagi: { some: { id_user: id } } },
    orderBy: { id: "desc" },
    include: {
      komentar_produk_berbagi: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_berbagi: true },
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
  const products = await prisma.berbagi_produk.findMany({
    orderBy: { id: "desc" },
    take: 3,
    include: {
      komentar_produk_berbagi: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_berbagi: true },
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
  const product = await prisma.berbagi_produk.findUnique({
    where: { id },
    include: {
      komentar_produk_berbagi: {
        select: {
          id: true,
          id_user: true,
          isi: true,
          tanggal_dibuat: true,
          gambar: true,
          is_approve: true,
          user: {
            select: {
              profil: true,
              nama: true,
            },
          },
        },
      },
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_berbagi: true },
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
  const product = await prisma.berbagi_produk.findMany({
    where: { id_kategori: id },
    orderBy: { id: "desc" },
    include: {
      komentar_produk_berbagi: true,
      user: {
        select: {
          nama: true,
          email: true,
          profil: true,
          path_profil: true,
        },
      },
      _count: {
        select: { komentar_produk_berbagi: true },
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
  const product = await prisma.berbagi_produk.findMany({
    where: { id_kategori: id },
    take: 3,
    orderBy: { id: "desc" },
    include: {
      komentar_produk_berbagi: true,
      _count: {
        select: { komentar_produk_berbagi: true },
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

export const deleteById = async (id, id_user) => {
  const gallery = await prisma.berbagi_produk.findMany({
    where: { id: id },
  });

  for (const file of gallery) {
    fs.unlinkSync(file.gambar);
  }

  await prisma.berbagi_produk.delete({
    where: { id: id, id_user: id_user },
  });
};

export const createProduct = async (data) => {
  return await prisma.berbagi_produk.create({ data });
};

export const updateProduct = async (data, id) => {
  if (data.gambar) {
    const product = await getById(id);
    fs.unlinkSync(product.gambar);
    return await prisma.berbagi_produk.update({
      where: { id: id },
      data: {
        user: { connect: { id: parseInt(data.id_user, 10) } },
        nama: data.nama,
        deskripsi: data.deskripsi,
        kebutuhan: data.kebutuhan,
        gambar: data.gambar,
      },
    });
  } else {
    return await prisma.berbagi_produk.update({
      where: { id: id },
      data: {
        user: { connect: { id: parseInt(data.id_user, 10) } },
        nama: data.nama,
        deskripsi: data.deskripsi,
        kebutuhan: data.kebutuhan,
      },
    });
  }
};

export const createComment = async (data) => {
  return await prisma.komentar_produk_berbagi.create({
    data: {
      gambar: data.gambar,
      isi: data.isi,
      is_approve: false,
      berbagi_produk: {
        connect: { id: data.id_produk },
      },
      user: {
        connect: { id: data.id_user },
      },
    },
  });
};

export const deleteCommentById = async (id_gallery, id_user) => {
  const comment = await prisma.komentar_produk_berbagi.findFirst({
    where: { id: id_gallery, id_user: id_user },
    select: {
      gambar: true,
    },
  });

  fs.unlinkSync(comment.gambar);
  await prisma.komentar_produk_berbagi.delete({
    where: { id: id_gallery },
  });
};

export const checkComment = async (id_comment, id_user) => {
  return await prisma.komentar_produk_berbagi.findFirst({
    where: { id: parseInt(id_comment, 10), id_user: parseInt(id_user, 10) },
    select: {
      gambar: true,
    },
  });
};

export const approveComment = async (id_comment, id_user) => {
  return await prisma.komentar_produk_berbagi.update({
    where: { id: parseInt(id_comment, 10), id_user: parseInt(id_user, 10) },
    data: {
      is_approve: true,
    },
  });
};

export const getCommentByUser = async (id) => {
  const comments = await prisma.komentar_produk_berbagi.findMany({
    where: { id_user: id },
    orderBy: { id: "desc" },
    include: {
      berbagi_produk: true,
    },
  });

  if (comments === null) {
    return null;
  } else {
    return comments;
  }
};
