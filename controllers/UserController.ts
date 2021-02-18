import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { UserModels } from "../Models/UserModel.ts";
import EmailException from "../exceptions/EmailException.ts"
import PasswordException from "../exceptions/PasswordException.ts";
import DateException from "../exceptions/DateException.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import CardException from "../exceptions/CardException.ts";
import { Bson } from "https://deno.land/x/mongo@v0.21.0/mod.ts";
import { sendMailAddChild, sendMailInscription, sendMailDeleteUser, sendMailSubscription, sendMailReSubscription } from "../helpers/mails.helpers.ts";
import {BillModel} from '../Models/BillModel.ts'
import { addCard, addCustomer, payment, AddCustomerCardStripe } from "../helpers/stripes.helpers.ts";


export class UserController {


    static login = async(req: Request, res: Response) => {
        try {
            
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

            const user = new UserModels(firstname,lastname,sexe,'Tuteur',email,password,birthDate);
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
        try{
            const getReqUser: any = req;
            const payload : UserInterfaces = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            })
            if(user){
                if(user.role !== 'Tuteur')throw new Error (`Vos droits d'accès ne permettent pas d'accéder à la ressource`);
                const {id,cvc} = req.body;
                if(!id || !cvc) throw new Error ('Une ou plusieurs données obligatoire sont manquantes');
                if(!CardException.isValidCcv(cvc)) throw new Error ('Une ou plusieurs données sont erronées');
                if(user.card == []) throw new Error ('Veuillez compléter votre profil avec une carte de crédit');
                const ExistCard = user.card.filter((card) => card.id === parseInt(id))[0];
                if(!ExistCard) throw new Error('Veuillez compléter votre profil avec une carte de crédit');
                
                addCard(parseInt(ExistCard.cartNumber),parseInt(ExistCard.month),parseInt(ExistCard.year)).then(
                    (data)=>{
                        const stripeCard = data.data;
                        addCustomer(user.email,user.firstname+' '+user.lastname).then(
                            (data) =>{
                                const stripeCustomer = data.data;
                                AddCustomerCardStripe(stripeCustomer.id,stripeCard.id).then(
                                    async () => {
                                        const alreadyExist = (await BillModel.getBills(<string>user._id)).length !== 0;
                                        if (alreadyExist) {
                                            payment(stripeCustomer.id, 'price_1IMDMUDWgEW6nkIHCLvLF0kb').then(
                                                async (body) => {
                                                    await UserModels.Subscription(user,1);
                                                    await sendMailReSubscription(user.email);
                                                    const bill = new BillModel(<string>user._id, body?.data.id, new Date(), 8.49, 9.99, 'Stripe');
                                                    await bill.insert();
                                                    res.status = 200;
                                                    return res.json({
                                                        error: true,
                                                        message: 'Votre abonnement a bien été mise à jour'
                                                    });
                                                },
                                                () => {res.status = 402;
                                                    res.json({
                                                    error: true,
                                                    message: "Echec du payement de l'offre"
                                            })}
                                            );
                                        }
                                        else{
                                            await UserModels.Subscription(user,1);
                                            setTimeout(()=>{
                                                payment(stripeCustomer.id,'price_1IMDMUDWgEW6nkIHCLvLF0kb').then(
                                                    async (body) =>{
                                                        await UserModels.Subscription(user,1);
                                                        await sendMailSubscription(user.email);
                                                        const bill = new BillModel(<string>user._id, body?.data.id, new Date(), 8.49, 9.99, 'Stripe');
                                                        await bill.insert();
                                                    },
                                                    async() => await UserModels.Subscription(user,0),
                                            )},60000*5 );
                                            res.status = 200;
                                            return res.json({
                                                error: true,
                                                message: "Votre période d'essai viens d'être activé - 5min"
                                            });
                                        }
                                    },
                                    () =>{
                                    res.status = 402;
                                    return res.json({
                                        error: true,
                                        message: "Echec du payement de l'offre"
                                    });}
                                );
                            }
                        )
                    }
                )
            }
        }
        catch(error){
            if (error.message === 'Une ou plusieurs données obligatoire sont manquantes'){
                res.status = 400;
                res.json({error: true, message: error.message});
            }
            if (error.message === "Une ou plusieurs données sont erronées"){
                res.status = 409;
                res.json({error: true, message : error.message});
            }
            if (error.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource"){
                res.status = 403;
                res.json({error: true, message: error.message});
            }
            if (error.message === "Veuillez compléter votre profil avec une carte de crédit"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }
        }      
    }
    
    static editUser = async(req: Request, res: Response) => {
        try{
            const {firstname,lastname,birthDate,sexe} = req.body;

            const getReqUser: any = req;
            const payload : UserInterfaces = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            })

            if(user){
                if (firstname) user.firstname = firstname;
                if (lastname) user.lastname = lastname;
                if (birthDate) user.birthDate = birthDate;
                if (sexe) user.sexe = sexe;
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
        try{
            const getReqUser: any = req;
            const payload: UserInterfaces = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            }); 
            if(user){
                await UserModels.userdb.delete({parent_id: user._id});
                await UserModels.userdb.delete({_id: user._id});
                await sendMailDeleteUser(user.email);
            }
            
            res.status = 200
            return res.json({
                error : false,
                message:"Votre compte et le compte de vos enfants ont été supprimés avec succès"
            })
        }
        catch (error){
            if(error.message === "Votre token n'est pas correct"){
                res.status = 401;
                res.json({error: true, message : error.message});
            }
        }

    }

    static createChild = async(req: Request, res: Response) => {
        try{
            const getReqUser: any = req;
            const payload: UserInterfaces = getReqUser.user;
            const parent : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            })
            if(parent){

                if(parent.role !== 'Tuteur') throw new Error ("Vos droits d'accès ne permettent pas d'accéder à la ressource");

                const {firstname,lastname,email,password,birthDate,sexe} = req.body;
                
                const child = new UserModels(firstname,lastname,sexe,'Enfant',email,password,birthDate);
                child.parent_id = parent._id;
                await child.insert();

                await sendMailAddChild(parent.email)
                res.status = 200
                return res.json({
                    error : false,
                    message : "Votre enfant a bien été créé avec succès",
                    child:{
                        firstname: child.firstname,
                        lastname: child.lastname,
                        email: child.email,
                        sexe: child.sexe,
                        role: child.role,
                        birthDate: child.birthDate,
                        createdAt: child.createdAt,
                        updatedAt: child.updatedAt,
                        subscription: child.subscription,
                    }
                })
            }
        }
        catch(error){
            if(error.message === "Une ou plusieurs données obligatoire sont manquantes"){
                res.status = 400;
                res.json({error: true, message : error.message});
            }
            if (error.message === "Votre token n'est pas correct"){
                res.status = 401;
                res.json({error: true, message : error.message});
            }
            if(error.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }
            if (error.message === 'Une ou plusieurs données sont erronées'){
                res.status = 409;
                res.json({error: true, message: error.message});
            }
            if(error.message === "Un compte utilisant cette adresse mail est déjà enregistré"){
                res.status = 409;
                res.json({error: true, message : error.message});
            }
            if(error.message === "Vous avez dépassé le cota de trois enfants"){
                res.status = 409;
                res.json({error: true, message : error.message});
            }
        }
    }
    
    static getChilds = async(req: Request, res: Response) => {
        try { 
            
            const getReqUser: any = req;
            const payload: any = getReqUser.user;
            const parent : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : new Bson.ObjectId(payload.id)
            })
            
            if(parent){
                if(parent.role !== "Tuteur") throw new Error ("Vos droits d'accès ne permettent pas d'accéder à la ressource");
                const Childs = await UserModels.userdb.find({parent_id: parent._id},{}).toArray();
                Childs.map((user: any) =>{
                    Object.assign(user, {_id: user._id});
                    delete user._id 
                    delete user.role
                    delete user.parent_id
                    delete user.email
                    delete user.password
                    delete user.refreshToken
                    delete user.token
                    delete user.lastLogin
                    delete user.attempt
                })
                res.status = 200
                return res.json({
                    error : false,
                    users:Childs
                })
            }
        } catch (error) {
            if(error.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }
            if (error.message === "Votre token n'est pas correct"){
                res.status = 401;
                res.json({error: true, message : error.message});
            }
        }
    }
    
    static deleteChild = async(req: Request, res: Response) => {
        try{
            const getReqUser: any = req;
            const payload: UserInterfaces = getReqUser.user;
            const parent : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            });
            
            if(parent){

                if(parent.role !== 'Tuteur') throw new Error ("Vos droits d'accès ne permettent pas d'accéder à la ressource");
                const {id_child} = req.body;
                
                if(id_child.length !== 24) throw new Error ("Vous ne pouvez pas supprimer cet enfant");
                
                const child : UserInterfaces|undefined = await UserModels.userdb.findOne({
                    _id : new Bson.ObjectId(id_child)
                });

                if(!child) throw new Error ("Vous ne pouvez pas supprimer cet enfant");
                
                if(child){
                    const validateMatching = (child.parent_id?.toString() !== parent._id?.toString());
                    if(validateMatching) throw new Error ("Vous ne pouvez pas supprimer cet enfant");
                    await UserModels.userdb.delete({_id: child._id})
                }
                res.status = 200
                return res.json({
                    error : false,
                    message:"L'utilisateur a été supprimée avec succès"
                })
            }
        }
        catch (error){
            if(error.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }
            if(error.message === "Vous ne pouvez pas supprimer cet enfant"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }
            if(error.message === "Votre token n'est pas correct"){
                res.status = 401;
                res.json({error: true, message : error.message});
            }
        }

    }
    static addCart = async(req: Request, res: Response) => {
        try{
            const{cartNumber, month , year } = req.body;

            const getReqUser: any = req;
            const payload : UserInterfaces = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            })
            if( !cartNumber || !month || !year || !req.body.default === undefined ) throw new Error("Veuillez compléter votre profil avec une carte de crédit");
            if(user?.role ===  "Enfant") throw new Error ("Vos droits d'accès ne permettent pas d'accéder à la ressource");
            if(!CardException.checkCard(cartNumber)) throw new Error ("Informations bancaire incorrectes");
            if(!CardException.isValidMonth(month) && month > 12) throw new Error ("Une ou plusieurs données sont erronées");
            if(!CardException.isValidYear(year) && year <= 21 ) throw new Error ("Une ou plusieurs données sont erronées");
            if(user){
                addCard(parseInt(cartNumber),parseInt(month),parseInt(year)).then(
                    async ()=>{
                        try{
                            const alreadyExist1 = await UserModels.userdb.findOne({cartNumber: cartNumber})
                            if(!alreadyExist1) user.card.push({id : user.card.length+ 1,cartNumber: cartNumber,
                            month:month,year:year,default:true});
                            else throw new Error('La carte existe déjà');
                            await UserModels.userdb.updateOne({_id: user._id}, user);
                            res.status = 200
                            return res.json({
                                error: false,
                                message: "Vos données ont été mises à jour",
                            })
                        }
                        catch(error){
                            if(error.message ==="La carte existe déjà"){
                                res.status = 409;
                                res.json({error: true, message : error.message});
                            }
                        }
                    },
                    () =>{
                        try{
                            throw new Error('Informations bancaire incorrectes');
                        }
                        catch(error){
                            if(error.message ==="Informations bancaire incorrectes"){
                                res.status = 402;
                                res.json({error: true, message : error.message});
                            }
                        }
                    }
                )
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
            if (error.message === 'Une ou plusieurs données sont erronées'){ 
                res.status = 409;
                res.json({error: true, message: error.message});
            }
        }
        
    }
    
    static logout = async(req: Request, res: Response) => {
        try{
            const getReqUser: any = req;
            const payload : any = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : payload._id
            })
            if(user){
                user.token = "";
                user.refreshToken = "";
                await UserModels.userdb.updateOne({_id : user._id}, user);
            }
            res.status = 200;
            return res.json({ error: false, message: "L'utilisateur a été déconnecté avec succès" });
            
            
        }catch(error){
            if(error.message === "Votre token n'est pas correct" ){
                res.status = 401;
                res.json({error: true, message : error.message});
            }

        }
    }
     
    static userdb: any;
    
}
