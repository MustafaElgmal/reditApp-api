import { Router } from "express";
import { Comment } from "../entities/comment";
import { Post } from "../entities/post";
import { User } from "../entities/user";
import { vaildateComment } from "../functions";

const router=Router()

router.post('/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(400).send({error:"Post id is required as params!"})
    }
    if(typeof +id !=='number'){
        return res.status(400).send({error:'Post id should be number!'})
    }
    const errors=await vaildateComment(req.body)
    if(errors.error!==''){
        return res.status(400).send(errors)
    }
    try{
        const post=await Post.findOne({where:{id:+id}})
        if(!post){
            return res.status(404).send({error:'Post not found!'})
        }
        const {body,userId}=req.body
        const user=await User.findOne({where:{id:+userId}})
        if(!user){
            return res.status(404).send({error:'User not found!'})
        }
        const comment=Comment.create({
            body,
            userId,
            postId:+id
        })
        await comment.save()
        await post.save()

        res.status(201).send({comment})
    }catch(e){
        console.log(e)
        res.status(500).send({error:'Server is down!'})
    }
    

})


router.get('/',async(req,res)=>{
    try{
        const comments=await Comment.find({relations:{user:true}})
        res.send({comments})

    }catch(e){
        res.status(500).send({error:'Server is down!'})

    }
})

router.get('/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(400).send({error:"Comment id is required as params!"})
    }
    try{
        const comment=await Comment.findOne({where:{id:+id},relations:{user:true}})
        if(!comment){
            return res.status(404).send({error:"Comment not found!"})
        }
        res.send({comment})
    }catch(e){
        res.status(500).send({error:'Server is down!'})

    }
})

router.delete('/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(401).send({error:'Comment id is required as paramters!'})
    }
    try{
        const comment=await Comment.findOne({where:{id:+id}})
        if(!comment){
            return res.status(404).send({error:"comment is not found!"})
        }
        const post=await Post.findOne({where:{id:comment.postId}})
        if(post){
            await post.save()
        }
        await Comment.delete(parseInt(id))
        
        res.send({message:"comment deleted!"})
    }catch(e){
        res.status(500).send({error:"Server is down !"})
    }

})
export default router