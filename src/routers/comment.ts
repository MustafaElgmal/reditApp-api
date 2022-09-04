import { commentCreate } from './../types';
import { Router } from "express";
import { Comment } from "../entities/comment";
import { Post } from "../entities/post";
import { User } from "../entities/user";
import { auth } from "../middlewares/auth";
import { RequestAuth } from "../types";
import { vaildateComment } from "../utils/vaildation";

const router = Router();

router.post("/:id",auth, async (req:RequestAuth, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Post id is required as params!" });
  }
  const error = await vaildateComment(req.body);
  if (error.error !== "") {
    return res.status(400).json(error);
  }
  try {
    const post = await Post.findOne({ where: { id: +id } });
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }
    const { body }:commentCreate = req.body;
    const user=req.user!
    const comment = Comment.create({
      body,
      user,
      post,
    });
    await comment.save();

    res.status(201).json({ comment });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});


router.get("/:id",auth, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Comment id is required as params!" });
  }
  try {
    const comment = await Comment.findOne({
      where: { id: +id },
      relations: { user: true },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found!" });
    }
    res.json({ comment });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});

router.delete("/:id",auth, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(401)
      .json({ error: "Comment id is required as paramters!" });
  }
  try {
    const comment = await Comment.findOne({ where: { id: +id } });
    if (!comment) {
      return res.status(404).json({ error: "comment is not found!" });
    }
    await Comment.delete(parseInt(id));

    res.json({ message: "comment deleted!" });
  } catch (e) {
    res.status(500).send({ error: "Server is down !" });
  }
});
export default router;
