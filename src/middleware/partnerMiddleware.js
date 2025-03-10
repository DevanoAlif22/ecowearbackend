import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userPartner = async (req, res, next) => {
  const uuid_session = req.headers.authorization;

  if (!uuid_session) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { uuid_session },
      select: { id_role: true },
    });

    if (user.id_role === 2) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error during authentication",
    });
  }
};

export default userPartner;
