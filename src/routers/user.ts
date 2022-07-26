import {Router} from "express";
import { User } from "../entities/user";
import { vaildateLogin, vaildateUser } from "../functions";
import {hash} from 'bcrypt'


const router=Router()

router.post('/',async(req,res)=>{
    const errors=await vaildateUser(req.body)
    if(errors.error!==''){
        return res.status(400).json(errors)
    }

    try{
        let {firstName,lastName,email,password}=req.body
        password=await hash(req.body.password,8)
        const user=User.create({
            firstName,
            lastName,
            email,
            password
        })
        await user.save()
        res.status(201).send({user})

    }catch(e){
        res.status(500).send({error:"Server is down !"})

    }

})


router.post('/login',async(req,res)=>{
    const errors=await vaildateLogin(req.body)
    if(errors.error!==''){
        return res.status(400).send(errors)
    }
    try{
        const {email}=req.body
        const user=await User.findOne({where:{email}})
        res.send({user})
    }catch(e){
       res.status(500).send({error:'Server is down!'})
    }

})

router.get('/',async(req,res)=>{
    try{
        const users=await User.find()
        res.send({users})
    }catch(e){
        res.status(500).send({error:'Server is down!'})
    }

})

router.get('/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(401).send({error:'User Id is required as paramters!'})
    }
    try{
        const user=await User.findOne({where:{id:+id},relations:{posts:true}})
        if(!user){
            return res.status(404).send({error:"User was not found !"})
        }
        res.send({user})
    }catch(e){
        res.status(500).send({error:'Server is down!'})
    }

})

router.delete('/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(401).send({error:'User Id is required as paramters!'})
    }
    try{
        const user=await User.findOne({where:{id:+id}})
        if(!user){
            return res.status(404).send({error:"User not found !"})
        }
        await User.delete(parseInt(id))
        res.send({message:'User is deleted!'})
    }catch(e){
        console.log(e)
        res.status(500).send({error:'Server is down!'})
    }
    
})

export default router