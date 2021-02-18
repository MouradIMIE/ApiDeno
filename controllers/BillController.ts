import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { BillModel } from "../Models/BillModel.ts";
import { UserModels } from "../Models/UserModel.ts";

export class BillController {


    static getBill = async(req: Request, res: Response) => {
        try{
            const getReqUser: any = req;
            const payload : UserInterfaces = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            })
            if(user){
                if(user.role !== 'Tuteur') throw new Error("Vos droits d'accès ne permettent pas d'accéder à la ressource");
                const bills =  await BillModel.getBills(<string> user._id);
                const factures = bills;
                res.status = 200;
                return res.json({
                    error:false,
                    bills : factures
                })
            }
        }
        catch(error){
            if(error.message ==="Vos droits d'accès ne permettent pas d'accéder à la ressource"){
                res.status = 403;
                res.json({error:true,message:"Vos droits d'accès ne permettent pas d'accéder à la ressource"});
            }
        }
    }
}