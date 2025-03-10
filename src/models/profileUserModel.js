import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";

export const get = async () => {
  const user = await prisma.user.findMany({
    select: {
      password: false,
      nama: true,
      email: true,
      profil: true,
      badan: true,
      path_profil: true,
      nomor_telepon: true,
      dokumen_pendukung: true,
      path_dokumen_pendukung: true,
      nama_rekening: true,
      nomor_rekening: true,
      poin: true,
      role: true, // Mengambil relasi role
      produk_jual: true,
      transaksi_produk: true,
      berbagi_produk: true,
      tukar_produk: true,
      penukaran_produk: true,
    },
  });

  return user; // Jika null, tetap akan mengembalikan null secara default
};
export const getById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      password: false,
      nama: true,
      bio: true,
      email: true,
      profil: true,
      badan: true,
      path_profil: true,
      nomor_telepon: true,
      dokumen_pendukung: true,
      path_dokumen_pendukung: true,
      nama_rekening: true,
      nomor_rekening: true,
      poin: true,
      role: true, // Mengambil relasi role
      produk_jual: true,
      transaksi_produk: true,
      berbagi_produk: true,
      tukar_produk: true,
      penukaran_produk: true,
    },
  });

  return user; // Jika null, tetap akan mengembalikan null secara default
};

export const getBodyById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      badan: true,
    },
  });
  if (user.badan === null || user.badan === "") {
    user.badan = "src/uploads/manekin.jpg";
  }
  return user; // Jika null, tetap akan mengembalikan null secara default
};

export const checkById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  return user;
};

export const updateProfileById = async (data, id, profilCheck, badanCheck) => {
  const user = await prisma.user.findFirst({
    where: { id: id },
  });
  if (profilCheck === true && user.profil !== null) {
    fs.unlinkSync(user.profil);
  }
  if (badanCheck === true && user.badan !== null) {
    fs.unlinkSync(user.badan);
  }
  const userUpdate = await prisma.user.update({
    where: { id },
    data,
  });

  return userUpdate;
};
