import express,{json,urlencoded} from 'express'
import {config} from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { connectionDB } from './dp/connection'
import userRouter from './routers/user'
import postRouter from './routers/post'
import commentRouter from './routers/comment'
import voteRouter from './routers/vote' 
import tagRouter from './routers/tag'

const app=express()
config()
app.use(cors())
app.use(morgan("dev"))
app.use(helmet())
app.use(json())
app.use(urlencoded({extended:false}))
app.use('/users',userRouter)
app.use('/posts',postRouter)
app.use('/comments',commentRouter)
app.use('/votes',voteRouter)
app.use('/tags',tagRouter)

app.get('*',(req,res)=>{
    res.status(401).send({error:'Api not found!'})
})

const port=process.env.PORT||4000

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`)
    connectionDB()
})

