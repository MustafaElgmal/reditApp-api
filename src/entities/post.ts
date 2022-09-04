import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Comment } from "./comment";
import { Tag } from "./tag";
import { User } from "./user";
import { Vote } from "./vote";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true })
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.post, { nullable: true })
  votes: Vote[];

  @ManyToMany(() => Tag, (tag) => tag.posts, { onDelete: "CASCADE" })
  @JoinTable({ name: "postTag" })
  tags: Tag[];
}
