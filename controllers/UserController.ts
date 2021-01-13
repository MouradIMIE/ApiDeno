import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import * as jwt from '../helpers/jwt.helpers.ts';
import { UserModels } from "../Models/UserModel.ts";



export class UserController {


    static login = async(req: Request, res: Response) => {
        try {
            // Récupération des inputs dans body
            const {email,password} = req.body;

            if(!email||!password){
                new Error ('Email/password manquants')
            }
    
            const user = await UserModels.login(email,password);
    
            const token = {
                "access_token": jwt.getAuthToken(user),
                "refresh_token": jwt.getRefreshToken(user),
            }
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
        }
        catch (error){
            
            if(error.message ==='Email/password manquants'){
                res.status = 400;
                res.json({error: true, message: error.message});
            }
            else if(error.message ==='Email/password incorrect'){
                res.status = 400;
                res.json({error: true, message: error.message});
            }
            else{
                res.status = 429;
                res.json({error: true, message: error.message});
            }
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
     
    static userdb: any;
    
}