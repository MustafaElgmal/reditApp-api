import { User } from "./../entities/user";
import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { RequestAuth } from "../types";

export const auth = async (req: RequestAuth, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization === undefined) {
    return res.status(401).json({ error: "Please Authenticate!" });
  }
  try {
    const { email } = jwt.verify(authorization!, process.env.PRIVITEKEY!) as {
      email: string;
    };
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send({ error: "Please vaild Authenticate !" });
    }
    req.user=user
    next()
  } catch (e) {
    res.status(401).json({ error: "Please vaild Authenticate!" });
  }
};
