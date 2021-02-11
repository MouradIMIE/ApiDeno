import { opine, Application } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Request, Response, NextFunction } from "https://deno.land/x/opine@1.0.2/src/types.ts";

const middleware: Application = opine();

middleware.use((req : Request, res : Response, next: NextFunction)=>{
    try{
        const {name,cover,url,type,time} = req.body;
        if(req.method === 'POST'){
            if( name.length < 2 || name.length > 50 ) throw new Error("Une ou plusieurs données sont erronées");
            if( cover.length < 15 || cover.length > 255 ) throw new Error("Une ou plusieurs données sont erronées");
            if( url.length < 10 || url.length > 200 ) throw new Error("Une ou plusieurs données sont erronées");
            if( type.length < 5 || url.length > 50 ) throw new Error("Une ou plusieurs données sont erronées")
        }
        next()
    }
    catch(error){
        if(error.message === 'Une ou plusieurs données sont erronées'){
            res.status = 409;
            res.json({error:true, message: error.message});
        }
        if(error.message === 'Une ou plusieurs données obligatoire sont manquantes'){
            res.status = 400;
            res.json({error:true, message: error.message});
        }
    }
})

export {middleware as UserMiddlewares}