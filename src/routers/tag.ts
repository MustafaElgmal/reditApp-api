import { Router } from "express";
import { Tag } from "../entities/tag";
import { vaildateTag } from "../functions";
const router=Router()

router.post('/',async(req,res)=>{
    const errors=await vaildateTag(req.body)
    if(errors.error!==''){
        return res.status(400).send(errors)
    }
    try{
        const {title}=req.body
        const tag=Tag.create({
            title
        })
        await tag.save()
        res.send({message:'Tag created!'})
    }catch(e){
        res.status(500).send({error:'Server is down!'})
    }
})

router.get('/',async(req,res)=>{
    try{
        const tags=await Tag.find()
        res.send({tags})

    }catch(e){
        res.status(500).send({error:'Server is down!'})
    }
})

router.get('/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(400).send({error:'Tag id is required as paramters!'})
    }
    try{
        const tag=await Tag.findOneBy({id:+id})
        if(!tag){
            return res.status(404).send({error:'Tag not found!'})
        }
        res.send({tag})
    }catch(e){
        res.status(500).send({error:'Server is down!'})
    }
})

router.delete('/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(400).send({error:'Tag id is required as paramters!'})
    }
    try{
        const tag=await Tag.findOneBy({id:+id})
        if(!tag){
            return res.status(404).send({error:'Tag not found!'})
        }

       await Tag.delete(parseInt(id))
        res.send({message:'Tag deleted!'})
    }catch(e){
        res.status(500).send({error:'Server is down!'})
    }
})

export default router