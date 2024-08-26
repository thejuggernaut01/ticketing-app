import express from "express";
import { body } from "express-validator";
import { login, signUp } from "../controllers/auth.controller";
import { validateRequest } from "../common/middlewares/validate-request";
import { currentUser } from "../common/middlewares/current-user";

const router = express.Router();

router.get("/current-user", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  signUp
);

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  login
);

router.post("/signout", (req, res) => {
  req.session = null;

  res.send({});
});

export default router;
