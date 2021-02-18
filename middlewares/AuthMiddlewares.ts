import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Request, Response, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { Bson } from "https://deno.land/x/mongo@v0.21.0/mod.ts";
import * as jwt from '../helpers/jwt.helpers.ts';
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { UserModels } from "../Models/UserModel.ts";


const middleware: Application = opine();

middleware.use(async (req: Request, res: Response , next: NextFunction)=>{
    try{
        const token: string|null|undefined = req.headers.get('authorization')?.replace('Bearer ','');
        const user: any = (token)? await jwt.getJwtPayload('eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.' + token + '.') : null;
        if(user == null || user == undefined) throw new Error("Votre token n'est pas correct");
        const checkUser : UserInterfaces | undefined = await UserModels.userdb.findOne({
            _id : new Bson.ObjectId(user.id)
        })
        if (token == null || token == undefined || token !== checkUser?.token) throw new Error("Votre token n'est pas correct");

        if(checkUser && token == checkUser.token && user != null && user.id != undefined){
            Object.assign(req, {user: user});
            next();       
        }
    }catch(error){
        if(error.message === "Votre token n'est pas correct"){
            res.status = 401;
            res.json({error:true, message: error.message});
        }
    }   
})

export {middleware as AuthMiddlewares}