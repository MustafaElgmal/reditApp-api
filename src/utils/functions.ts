import { Post } from "./../entities/post";
import jwt from 'jsonwebtoken'
export const AddlengthsOnPost = (posts: Post[]) => {
  const postswithExtra = posts.map((post) => ({
    ...post,
    commentsTotal: post.comments.length,
    upVotesTotal: post.votes.filter((vote) => vote.userVote === 1).length,
    downVotesTotal: post.votes.filter((vote) => vote.userVote === -1).length,
  }));

  return postswithExtra
};

export const generateAuth=(email:string):string=>{
  const token=jwt.sign({email},process.env.PRIVITEKEY!)
  return token
}


