import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post";
import { User } from "./user";

@Entity()
export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    body:string

    @Column()
    userId:number

    @Column()
    postId:number

    @CreateDateColumn({type:'timestamp'})
    createAt:Date

    @UpdateDateColumn({type:'timestamp',onUpdate:'CURRENT_TIMESTAMP(6)'})
    updateAt:Date

    @ManyToOne(()=>Post,(post)=>post.comments,{nullable:false,onDelete:'CASCADE',onUpdate:'CASCADE'})
    post:Post

    @ManyToOne(()=>User,(user)=>user.comments,{nullable:false,onDelete:'CASCADE',onUpdate:'CASCADE'})
    user:User

}