import { Router } from "express";
import { Post } from "../entities/post";
import { User } from "../entities/user";
import { vaildatePost } from "../functions";

const router = Router();

router.post("/", async (req, res) => {
  const errors = await vaildatePost(req.body);
  if (errors.error !== "") {
    return res.status(400).send(errors);
  }
  try {
    const { title, body, userId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).send({ error: "User is not found!" });
    }
    const post = Post.create({ title, body, userId });
    await post.save();
    res.status(201).send({ post });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Server is down!" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({
      relations: { comments: true, votes: true, user: true },
    });
    const rss = posts.map((post) => {
      return {
        ...post,
        commentsTotal: post.comments.length,
        upVoteTotal: post.votes.filter((vote) => vote.userVote === 1).length,
        downVoteTotal: post.votes.filter((vote) => vote.userVote === -1).length,
      };
    });
    res.send({ posts: rss });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Server is down!" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).send({ error: "Post id is required as paramters!" });
  }

  try {
    const postfind = await Post.findOne({
      where: { id: +id },
      relations: { comments: true, votes: true },
    });

    if (!postfind) {
      return res.status(404).send({ error: "post is not found!" });
    }
    const post={...postfind,
        commentsTotal: postfind.comments.length,
        upVoteTotal: postfind.votes.filter((vote) => vote.userVote === 1).length,
        downVoteTotal: postfind.votes.filter((vote) => vote.userVote === -1).length}

    res.send({ post });
  } catch (e) {
    res.status(500).send({ error: "Server is down !" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).send({ error: "Post id is required as paramters!" });
  }
  try {
    const post = await Post.findOne({ where: { id: +id } });
    if (!post) {
      return res.status(404).send({ error: "Post not found !" });
    }
    await Post.delete(parseInt(id));
    res.send({ message: "post deleted!" });
  } catch (e) {
    res.status(500).send({ error: "Server is down !" });
  }
});
export default router;
