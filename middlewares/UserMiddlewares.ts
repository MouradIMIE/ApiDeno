//UserMiddlewares
import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import DateException from "../exceptions/DateException.ts";
import EmailException from "../exceptions/EmailException.ts";
import PasswordException from "../exceptions/PasswordException.ts"
import { Request, Response, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";

const middleware: Application = opine();

middleware.use((req : Request, res : Response, next: NextFunction)=>{
    try{
        const {firstname,lastname,email,birthDate,sexe} = req.body;

        if( firstname.length < 2 || firstname.length > 25 ) throw new Error("Une ou plusieurs données sont erronées");
        if( lastname.length < 2 || lastname.length > 25 ) throw new Error("Une ou plusieurs données sont erronées");
        if( email.length < 10 || lastname.length > 150 ) throw new Error("Une ou plusieurs données sont erronées");
        
        next()
    }
    catch(error){
        if(error.message === 'Une ou plusieurs données sont erronées'){
            res.status = 409;
            res.json({error:true, message: error.message});
        }
    }
})

export {middleware as UserMiddlewares}