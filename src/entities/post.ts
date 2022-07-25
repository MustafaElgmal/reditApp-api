import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn,PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Comment } from "./comment";
import { User } from "./user";
import { Vote } from "./vote";

@Entity()
export class Post extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string

    @Column()
    body:string
    @Column()
    userId:number

    @CreateDateColumn({type:'timestamp'})
    createdAt:Date

    @UpdateDateColumn({type:'timestamp',onUpdate:'CURRENT_TIMESTAMP(6)'})
    updateAt:Date

    @ManyToOne(()=>User,(user)=>user.posts,{nullable:false,onDelete:'CASCADE',onUpdate:'CASCADE'})
    user:User

    @OneToMany(()=>Comment,(comment)=>comment.post,{nullable:true})
    comments:Comment[]

    @OneToMany(()=>Vote,(vote)=>vote.post,{nullable:true})
    votes:Vote[]

    @Column({default:0})
    commentsTotal:number

    @Column({default:0})
    downVoteTotal:number

    @Column({default:0})
    upVoteTotal:number


}