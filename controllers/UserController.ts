import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { UserModels } from "../Models/UserModel.ts";
import EmailException from "../exceptions/EmailException.ts"
import PasswordException from "../exceptions/PasswordException.ts";
import DateException from "../exceptions/DateException.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { sendMailInscription } from "../helpers/mails.helpers.ts";
import { CardModel } from "../Models/CardModel.ts";
import CardException from "../exceptions/CardException.ts";
import CardInterface from "../interfaces/CardInterace.ts";
import { compareCard } from "../helpers/card.helpers.ts";

export class UserController {


    static login = async(req: Request, res: Response) => {
        try {
            // Récupération des inputs dans body
            const {email,password} = req.body;

            if(!email||!password) throw new Error('Email/password manquants');

            const user = await UserModels.login(email,password);
    
            const token = await UserModels.AuthTokenGenerator(user) 
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
            
            if(!EmailException.checkEmail(email)||!PasswordException.isValidPassword(password)) throw new Error('Une ou plusieurs données sont erronées');
            if (!DateException.checkDate(birthDate)) throw new DateException('Une ou plusieurs données sont erronées');

            const user = new UserModels(firstname,lastname,sexe,email,password,birthDate);
            await user.insert();
            await sendMailInscription(user.email);
            
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
            if(error.message ==='Une ou plusieurs données sont erronées'){
                res.status = 409;
                res.json({error:true, message: error.message});
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
        try{
            const {firstname,lastname,email,birthDate,sexe} = req.body;
            if (!EmailException.checkEmail(email)) throw new EmailException('Une ou plusieurs données sont erronées');
            if (!DateException.checkDate(birthDate)) throw new DateException('Une ou plusieurs données sont erronées');
            if (sexe!== 'Male' && sexe !=='Female') throw new Error('Une ou plusieurs données sont erronées'); 

            const getReqUser: any = req;
            const payload : UserInterfaces = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            })

            if(user){
                user.firstname = firstname;
                user.lastname = lastname;
                user.email = email;
                user.birthDate = birthDate;
                user.sexe = sexe;
                user.updatedAt = new Date();
                await UserModels.userdb.updateOne({_id: user._id}, user);
            }
            if(user)
            res.status = 200
            return res.json({
                error : false,
                message : "Vos données ont été mises à jour",
            });
        }
        catch(error){
            if (error.message === 'Une ou plusieurs données sont erronées'){
                res.status = 409;
                res.json({error: true, message: error.message});
            }
            if (error.message === "Votre token n'est pas correct"){
                res.status = 401;
                res.json({error: true, message : error.message});
            }
        }
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
        try{
            const{holderName , cartNumber, month , year, ccv } = req.body;

            if(!CardException.checkCard(cartNumber)) throw new Error ("Informations bancaire incorrectes");
            if(!CardException.isValidMonth(month) && month >= 31 && year <= 1) throw new Error ("Une ou plusieurs données sont erronées");
            if(!CardException.isValidYear(year) && year >= 99 && year <= 21) throw new Error ("Une ou plusieurs données sont erronées");

            const getReqUser: any = req;
            const payload : UserInterfaces = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            })

          /*  
            const used = await CardModel.CardDB.findOne({
            cartNumber: cartNumber
            });

            if(used)throw new Error ("La carte existe déjà");*/
            if(user?.role ===  "Child") throw new Error ("Vos droits d'accès ne permettent pas d'accéder à la ressource");

            const card = new CardModel(holderName , cartNumber, month , year, ccv);
            await card.insert();
            if(card){
                res.status = 200;
                res.json({ error: false, message: "Vos données ont été mises à jour" });
            }

        }catch(error){
            if (error.message === "Votre token n'est pas correct"){ 
                res.status = 401;
                res.json({error: true, message : error.message});
            }
            if (error.message === 'Informations bancaire incorrectes'){
                res.status = 402;
                res.json({error: true, message: error.message});
            }
            if (error.message === "La carte existe déjà"){
                res.status = 409;
                res.json({error: true, message : error.message});
            }
            if (error.message ===  "Veuillez compléter votre profil avec une carte de crédit"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }
            if (error.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource"){ 
                res.status = 403;
                res.json({error: true, message: error.message});
            }
            if (error.message === 'Une ou plusieurs données sont erronées'){ // a faire
                res.status = 409;
                res.json({error: true, message: error.message});
            }
        }
        
    }
    
    static logout = async(req: Request, res: Response) => {
    
    }
     
    static userdb: any;
    
}