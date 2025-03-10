import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCategories = async () => {
  return await prisma.kategori.findMany();
};
export const getCategoryById = async (id) => {
  return await prisma.kategori.findUnique({ where: { id } });
};
