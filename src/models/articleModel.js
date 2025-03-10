import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createArticle = async (data) => {
  return await prisma.artikel.create({ data });
};

export const getArticles = async () => {
  return await prisma.artikel.findMany({
    orderBy: { id: "desc" },
  });
};
export const getListArticle = async () => {
  return await prisma.artikel.findMany({
    take: 3,
    orderBy: { id: "desc" },
  });
};
export const getArticleById = async (id) => {
  await prisma.artikel.update({
    where: { id },
    data: {
      dilihat: {
        increment: 1,
      },
    },
  });

  return await prisma.artikel.findUnique({ where: { id } });
};

export const deleteArticle = async (id) => {
  return await prisma.artikel.delete({ where: { id } });
};

export const updateArticle = async (id, data) => {
  return await prisma.artikel.update({ where: { id }, data });
};
