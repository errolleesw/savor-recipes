import express from "express";
// import passport from "passport";
import { registerUser, logoutUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/sign-up", (req, res) =>
  res.render("sign-up-form", { title: "Sign up" })
);
router.post("/sign-up", registerUser);

router.get("/log-in", (req, res) => res.render("log-in", { title: "Log in" }));
// router.post(
//   "/log-in",
//   passport.authenticate("local", {
//     successRedirect: "/recipes",
//     failureRedirect: "/log-in",
//   })
// );

router.get("/log-out", logoutUser);

export default router;
