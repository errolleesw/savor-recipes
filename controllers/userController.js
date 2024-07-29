// controllers/userController.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUser = async (req, res, next) => {
  try {
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password, // Storing password directly (not secure)
      },
    });
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
