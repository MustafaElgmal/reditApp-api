import { RequestAuth, voteCreate } from "./../types";
import { Router } from "express";
import { User } from "../entities/user";
import { Post } from "../entities/post";
import { Vote } from "../entities/vote";
import { vaildateVote } from "../utils/vaildation";
import { auth } from "../middlewares/auth";

const router = Router();
router.post("/:id", auth, async (req: RequestAuth, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Post id is required as paramters!" });
  }
  const error = await vaildateVote(req.body);
  if (error.error !== "") {
    res.status(400).json(error);
  }
  try {
    const post = await Post.findOne({
      where: { id: +id },
      relations: { votes: true, user: true },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }
    let { userVote }: voteCreate = req.body;
    const user = req.user!;
    const votee = Vote.create({ userVote, user, post });
    await votee.save();
    res.json({ message: "Vote was created" });
  } catch (e) {
    res.status(500).json({ error: "Server is down!" });
  }
});

export default router;
