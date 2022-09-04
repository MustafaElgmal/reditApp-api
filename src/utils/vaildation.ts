import {
  userCreate,
  postCreate,
  commentCreate,
  voteCreate,
  tagCreate,
} from "../types";
const vaildator = require("validator");
import { User } from "../entities/user";
import bcrypt from "bcrypt";

export const vaildateUser = async (user: userCreate) => {
  const { firstName, lastName, email, password } = user;
  if (!firstName) {
    return { error: "FirstName is required !" };
  }
  if (typeof firstName !== "string") {
    return { error: "FirstName should be string !" };
  }
  if (!lastName) {
    return { error: "LastName is required !" };
  }
  if (typeof lastName !== "string") {
    return { error: "LastName should be string !" };
  }
  if (!email) {
    return { error: "Email is required !" };
  }
  const emailFind = await User.findOne({ where: { email } });
  if (emailFind) {
    return { error: "Email is Already exists !" };
  }
  if (!vaildator.isEmail(email)) {
    return { error: "Email not vaild !" };
  }
  if (!password) {
    return { error: "Password is required !" };
  }
  if (!vaildator.isStrongPassword(password)) {
    return {
      error:
        "Password :minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
    };
  }
  return { error: "" };
};

export const vaildateLogin = async (user: {
  email: string;
  password: string;
}) => {
  const { email, password } = user;

  if (!email) {
    return { error: "Email is required !" };
  }
  const userFind = await User.findOne({ where: { email } });
  if (!userFind) {
    return { error: "Email is not vaild !" };
  }
  if (!password) {
    return { error: "Password is required !" };
  }
  const match = await bcrypt.compare(password, userFind.password);
  if (!match) {
    return { error: "Password is wrong !" };
  }

  return { error: "" };
};

export const vaildatePost = async (post: postCreate) => {
  const { title, body,tagIds } = post;

  if (!title) {
    return { error: "title is required !" };
  }
  if (typeof title !== "string") {
    return { error: "title should be string !" };
  }
  if (!body) {
    return { error: "body is required !" };
  }
  if (typeof body !== "string") {
    return { error: "body should be string !" };
  }
  if(tagIds===undefined || tagIds.length===0){
    return { error: "tagIds is required !" };

  }

  return { error: "" };
};

export const vaildateComment = async (comment: commentCreate) => {
  const { body } = comment;
  if (!body) {
    return { error: "body is required !" };
  }
  if (typeof body !== "string") {
    return { error: "body should be string !" };
  }
  return { error: "" };
};

export const vaildateVote = async (votee: voteCreate) => {
  const { userVote } = votee;
  if (!userVote) {
    return { error: "userVote is required!" };
  }
  if (typeof userVote !== "number") {
    return { error: "userVote must be number!" };
  }
  if (userVote !== -1 && userVote !== 1) {
    return { error: "User vote should be -1 or 1 !" };
  }
  return { error: "" };
};

export const vaildateTag = async (tag: tagCreate) => {
  const { title } = tag;
  if (!title) {
    return { error: "title is required!" };
  }
  if (typeof title !== "string") {
    return { error: "title should be string!" };
  }
  return { error: "" };
};
