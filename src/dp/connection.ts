import { createConnection } from "typeorm";
import { Comment } from "../entities/comment";
import { Post } from "../entities/post";
import { User } from "../entities/user";
import { Vote } from "../entities/vote";
export const connectionDB=async()=>{
    try{
        await createConnection({
            type: "postgres",
            host: process.env.PGHOST,
            port: +process.env.PGPORT!,
            username: process.env.PGUSER,
            password:process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            synchronize:true,
            logging:false,
            entities:[User,Post,Comment,Vote],
            migrations:["migration/*.ts"],
            subscribers:[]
        });

    }catch(e){
       console.log(e)
        console.log("ConnectionDB is notVaild!")
    }
}
