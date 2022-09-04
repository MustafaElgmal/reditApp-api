import { User } from './entities/user';
import { Request } from "express"

export interface userCreate{
    firstName:string
    lastName:string
    email:string
    password:string

}

export interface postCreate{
    title:string
    body:string
    tagIds:number[]

}

export interface commentCreate{
    body:string
    postId:number

}

export interface voteCreate{
    userVote:number
    postId:number
}

export interface tagCreate{
    title:string
}

export interface RequestAuth extends Request {
    user?:User
}