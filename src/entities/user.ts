import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post";
import { Comment } from "./comment";
import { Vote } from "./vote";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    firstName:string
    @Column()
    lastName:string
    @Column({unique:true})
    email:string
    @Column()
    password:string
    @Column({nullable:true})
    imgageUrl:string
    @Column({nullable:true})
    birthDate:Date
    @OneToMany(()=>Post,(post)=>post.user,{nullable:true})
    posts:Post[]
    @OneToMany(()=>Comment,(comment)=>comment.user,{nullable:true})
    comments:Comment[]
    @OneToMany(()=>Vote,(vote)=>vote.user,{nullable:true})
    votes:Vote[]
}
