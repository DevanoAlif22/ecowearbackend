import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userLogin = async (req, res, next) => {
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
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error during authentication",
    });
  }
};

export default userLogin;
