import { Router } from "express";
import { User } from "../entities/user";
import { Post } from "../entities/post";
import { Vote } from "../entities/vote";
import { vaildateVote } from "../functions";

const router = Router();
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: "Post id is required as paramters!" });
  }
  const errors = await vaildateVote(req.body);
  if (errors.error !== "") {
    res.status(400).send(errors);
  }
  try {
    const post = await Post.findOne({
      where: { id: +id },
      relations: { votes: true, user: true },
    });
    if (!post) {
      return res.status(404).send({ error: "Post not found!" });
    }
    let { userVote, userId } = req.body;
    const user = await User.findOne({ where: { id: +userId } });
    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }
    if (userVote !== -1 && userVote !== 1) {
      return res.status(400).send({ error: "User vote should be -1 or 1 !" });
    }
    const votee=Vote.create({userVote,userId,postId:+id})
    await votee.save()
    if(userVote===1){
        post.upVoteTotal++
        if(post.downVoteTotal!==0)
        post.downVoteTotal--
        
    }else{
        post.downVoteTotal++
        if(post.upVoteTotal!==0)
        post.upVoteTotal--
    }
    await post.save()
    res.send({ message: "Vote was created" });
  } catch (e) {
    res.status(500).send({ error: "Server is down!" });
  }
});


export default router;
