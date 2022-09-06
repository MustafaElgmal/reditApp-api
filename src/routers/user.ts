import { generateAuth } from './../utils/functions';
import { userCreate } from "./../types";
import { Router } from "express";
import { User } from "../entities/user";
import { vaildateLogin, vaildateUser } from "../utils/vaildation";
import { hash } from "bcrypt";

const router = Router();

router.post("/", async (req, res) => {
  const error = await vaildateUser(req.body);
  if (error.error !== "") {
    return res.status(400).json(error);
  }

  try {
    let { firstName, lastName, email, password }: userCreate = req.body;
    password = await hash(req.body.password, 8);
    const user = User.create({
      firstName,
      lastName,
      email,
      password,
    });
    await user.save();
    const token=generateAuth(user.email)
    res.status(201).json({ token });
  } catch (e) {
    res.status(500).json({ error: "Server is down !" });
  }
});

router.post("/signin", async (req, res) => {
  const error = await vaildateLogin(req.body);
  if (error.error !== "") {
    return res.status(400).json(error);
  }
  try {
    const { email }: { email: string } = req.body;
    const token=generateAuth(email)
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});


export default router;
