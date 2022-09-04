import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Post } from "./post";
import { User } from "./user";

@Entity()
export class Vote extends BaseEntity {
  @Column()
  userVote: number;

  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => User, (user) => user.votes, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.votes, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  post: Post;
}
