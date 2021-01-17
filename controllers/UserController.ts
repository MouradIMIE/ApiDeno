import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import * as jwt from '../helpers/jwt.helpers.ts';
import { UserModels } from "../Models/UserModel.ts";



export class UserController {


    static login = async(req: Request, res: Response) => {
        try {
            // Récupération des inputs dans body
            const {email,password} = req.body;

            if(!email||!password) throw new Error('Email/password manquants');

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
        try {
            const {firstname,lastname,email,password,birthDate,sexe} = req.body;

            if(!firstname||!lastname||!email||!password||!birthDate||!sexe) throw new Error('Une ou plusieurs données obligatoire sont manquantes');
            
            const user = new UserModels(firstname,lastname,sexe,email,password,birthDate);
            await user.insert();
            
            res.status = 200
            return res.json({
                error : false,
                message : "L'utilisateur a bien été créé avec succès",
                user:{
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    sexe: user.sexe,
                    role: user.role,
                    birthDate: user.birthDate,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    subscription: user.subscription,
                }
            })
        } catch(error){
            
            if(error.message ==='Une ou plusieurs données obligatoire sont manquantes'){
                res.status = 400;
                res.json({error: true, message: error.message});
            }
            if(error.message ==='Un compte utilisant cette adresse mail est déjà enregistré'){
                res.status = 409;
                res.json({error: true, message: error.message});
            }
            if(error.message ==='Email/password incorrect'){
                res.status = 400;
                res.json({error: true, message: error.message});
            }
        }

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
        try{
            const {email, password} = req.body;
            const user = await UserModels.logout(email,password);

            const token = {
                "access_token": jwt.getAuthToken(user),
                "refresh_token": jwt.getRefreshToken(user),
            }
            res.status = 200
            return res.json(
                { error: false, message: "L'utilisateur a été déconnecté avec succès" }
            )

        }catch(error){
                res.status = 401;
                res.json({ error: true, message: "Votre token n'est pas correct" });
            
            }
    }
     
    static userdb: any;
    
}