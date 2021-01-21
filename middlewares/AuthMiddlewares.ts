import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Request, Response, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import * as jwt from '../helpers/jwt.helpers.ts';


const middleware: Application = opine();

middleware.use(async (req: Request, res: Response , next: NextFunction)=>{
    const token: string|null|undefined = req.headers.get('authorization')?.replace('Bearer ','');
    const user: any = await jwt.getJwtPayload((token === undefined || token === null)?'':token);

    if(user != null && user.id != undefined){
        Object.assign(req, {user: user});
        next()    
    }else{
        res.status = 401
        return res.json({
            error : true,
            message : "Votre token n'est pas correct",
        })
    }    
} )

export {middleware as AuthMiddlewares}