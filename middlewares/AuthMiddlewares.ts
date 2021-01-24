import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Request, Response, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import * as jwt from '../helpers/jwt.helpers.ts';
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { UserModels } from "../Models/UserModel.ts";


const middleware: Application = opine();

middleware.use(async (req: Request, res: Response , next: NextFunction)=>{
    try{
        const token: string|null|undefined = req.headers.get('authorization')?.replace('Bearer ','');
        const user: any = await jwt.getJwtPayload((token === undefined || token === null)?'':token);
        if(user == null || user == undefined) throw new Error("Votre token n'est pas correct");
        const checkUser : UserInterfaces | undefined = await UserModels.userdb.findOne({
            _id : user._id
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