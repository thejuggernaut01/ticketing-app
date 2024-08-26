import { Request, Response } from "express";
import User from "../models/user";
import { BadRequestError } from "../common/errors/bad-request-error";
import jwt from "jsonwebtoken";
import { Password } from "../common/services/password";

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("Email is already in use");
  }

  const user = User.build({ email, password });
  await user.save();

  // Generate JWT
  const userJWT = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  // Store it on session object
  req.session = { jwt: userJWT };

  return res.status(201).json({ user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }

  const passwordMatch = await Password.compare(existingUser.password, password);

  if (!passwordMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  // Generate JWT
  const userJWT = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.JWT_KEY!
  );

  // Store it on session object
  req.session = { jwt: userJWT };

  return res.status(200).json({ existingUser });
};
