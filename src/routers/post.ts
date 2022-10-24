import { auth } from "../middlewares/auth";
import { Tag } from "./../entities/tag";
import { AddlengthsOnPost } from "./../utils/functions";
import { postCreate, RequestAuth } from "./../types";
import { Router } from "express";
import { Post } from "../entities/post";
import { User } from "../entities/user";
import { vaildatePost } from "../utils/vaildation";
import { In } from "typeorm";

const router = Router();

router.post("/", auth, async (req: RequestAuth, res) => {
  const error = await vaildatePost(req.body);
  if (error.error !== "") {
    return res.status(400).json(error);
  }
  try {
    let { title, body, tagIds }: postCreate = req.body;
    const user = req.user!;
    const tags = await Tag.find({ where: { id: In(tagIds) } });
    if (tags.length === 0) {
      return res.status(404).json({ error: "Tag is not found!" });
    }
    const post = Post.create({ title, body, user, tags });
    await post.save();
    res.status(201).json({ post });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find({
      relations: {
        comments: { user: true },
        votes: true,
        user: true,
        tags: true,
      },
    });
    const postswithExtraDetails = AddlengthsOnPost(posts);

    res.json({ posts: postswithExtraDetails });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});

router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).json({ error: "Post id is required as paramters!" });
  }

  try {
    const postfind = await Post.findOne({
      where: { id: +id },
      relations: {user: true, comments: { user: true }, votes: true, tags: true },
    });

    if (!postfind) {
      return res.status(404).json({ error: "post is not found!" });
    }
    const post = AddlengthsOnPost([postfind]);

    res.json({ post: post[0] });
  } catch (e) {
    res.status(500).json({ error: "Server is down !" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).json({ error: "Post id is required as paramters!" });
  }
  try {
    const post = await Post.findOne({ where: { id: +id } });
    if (!post) {
      return res.status(404).json({ error: "Post not found !" });
    }
    await Post.delete(parseInt(id));
    res.json({ message: "post deleted!" });
  } catch (e) {
    res.status(500).json({ error: "Server is down !" });
  }
});
export default router;
