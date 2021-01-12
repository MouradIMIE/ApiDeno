import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import * as jwt from '../helpers/jwt.helpers.ts';
import {UserModels} from "../Models/UserModel.ts"



export class UserController {


    static login = async(req: Request, res: Response) => {

        let data: any = req.body;
        let user = new UserModels('yani', 'yani', 'yani', 'yani', 'yani', "1993-11-22");
        
        try {
            const token = {
                "access_token": jwt.getAuthToken(user),
                "refresh_token": jwt.getRefreshToken(user),
            }
            if(data.email == user.email && data.password == user.password){
            res.status = 200
            return res.json(
                { error: false,
                message: "L'utilisateur a été authentifié succès", 
                user : { 
                    "firstname": user.firstname, 
                    "lastname": user.lastname, 
                    "email": user.email, 
                    "sexe": user.sexe, 
                    "role": user.role, 
                    "dateNaissance": user.birthDate, 
                    "createdAt": user.createdAt, 
                    "updateAt": user.updatedAt, 
                    "subscription" : user.subscription 
                }, 
                "token": token }
                );
            }else if (data.email != user.email && data.password != user.password){
                res.status = 400
                return res.json({ error: true, message: "Email/password incorrect" });
            }else if(data.email == null || data.password == null ){
                res.status = 400
                return res.json({ error: true, message: "Email/password manquants" });
               
            }else if(data.email == null && data.password == null ){
                res.status = 429
                return res.json({ error: true, message: "Trop de tentative sur l'email xxxxx (5 max) - Veuillez patienter (2min)" });
               
            }
        } catch (err) {
            res.status = 401;
            return res.json({ error: true, message: err.message });
        }
        
    }

    static register = async(req: Request, res: Response) => {

    }


    static subscription = async(req: Request, res: Response) => {

    }
    
    
    static editUser = async(req: Request, res: Response) => {
        
    }
    
    static deleteUser = async(req: Request, res: Response) => {

    }

    
    static createChild = async(req: Request, res: Response) => {
        
    }
    
    static getChilds = async(req: Request, res: Response) => {
        
    }
    
    static deleteChild = async(req: Request, res: Response) => {

    }

    
    static addCart = async(req: Request, res: Response) => {
        
    }
    
    static logout = async(req: Request, res: Response) => {
    
    }
    
}