import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const register = async (data) => {
  return await prisma.user.create({ data });
};

export const getByEmail = async (email) => {
  const data = await prisma.user.findMany({
    where: { email },
    select: {
      id: true,
      id_role: true,
      profil: true,
      nama: true,
      jenis: true,
      uuid_session: true,
      status: true,
      password: true,
    },
  });
  return data.length > 0 ? data : null;
};
export const getByIdUser = async (id) => {
  const data = await prisma.user.findMany({
    where: { id: parseInt(id, 10) },
    select: {
      id: true,
      id_role: true,
      profil: true,
      nama: true,
      email: true,
      jenis: true,
      uuid_session: true,
      status: true,
      password: true,
    },
  });
  return data.length > 0 ? data : null;
};

export const getPartner = async () => {
  const partners = await prisma.user.findMany({
    where: { id_role: 3 },
  });

  if (partners === null) {
    return null;
  } else {
    return partners;
  }
};

export const approvePartner = async (id) => {
  return await prisma.user.update({
    where: { id, status: "proses", id_role: 3 },
    data: { status: "aktif" },
  });
};
