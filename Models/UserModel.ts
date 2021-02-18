import { UserDatabase } from '../database/UserDatabase.ts';
import  {roleTypes }  from '../types/roleTypes.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { comparePass, hash } from '../helpers/password.helpers.ts';
import { sexeTypes } from '../types/sexeTypes.ts';
import {db} from '../database/database.ts'
import { getAuthToken, getRefreshToken } from "../helpers/jwt.helpers.ts";
import { cardType } from "../types/cardType.ts"

export class UserModels extends UserDatabase implements UserInterfaces {

    role: roleTypes;
    _id:string|{ $oid: string }|null|undefined;
    parent_id:string|{$oid:string}|null|undefined;
    firstname: string;
    lastname: string;
    sexe: sexeTypes;
    email: string;
    password: string;
    card : Array<cardType>;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
    subscription: number;
    lastLogin: Date;
    attempt: number;
    userdb: any;
    static userdb = db.collection <UserInterfaces> ("users");
    token: string;
    refreshToken: string;

    constructor(nom: string, prenom: string, sexe: sexeTypes,role :roleTypes, email: string, password: string, birthDate: Date) {
        super();

        this.firstname = prenom;
        this.lastname = nom;
        this.sexe = sexe;
        this.role = role
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.lastLogin = new Date();
        this.attempt = 0;
        this.subscription = 0;
        this.card = [];
        this.token = '';
        this.refreshToken = '';
        if(this.role === 'Enfant') {
            this.parent_id = ''
        }
    }

    async insert(): Promise<void> {
        const used = await this.userdb.findOne({
            email: this.email
        });
        
        if(used) throw new Error ("Un compte utilisant cette adresse mail est déjà enregistré");
        this.password = await hash(this.password);
        const insert = {
            role: this.role,
            firstname: this.firstname,
            lastname: this.lastname,
            sexe: this.sexe,
            card: this.card,
            password:this.password,
            email: this.email,
            birthDate: this.birthDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: new Date(),
            attempt: 0,
            subscription: this.subscription,
            token: this.token,
            refreshToken: this.refreshToken,
        };
        if(this.parent_id){
            const childNumber = await this.userdb.count({parent_id : this.parent_id});
            if(childNumber === 3) throw new Error ("Vous avez dépassé le cota de trois enfants");
            await Object.assign(insert,{parent_id:this.parent_id});
        }
        
        this._id = await this.userdb.insertOne(insert);
    }

    static async login(email :string, password:string): Promise < UserInterfaces >{
        
        const verifyUser: UserInterfaces | undefined   = await this.userdb.findOne({email:email});

        if (!verifyUser) throw new Error("Email/password incorrect") 

        if(((new Date().getTime() - verifyUser.lastLogin.getTime()) / 60 / 1000) >= 2 && verifyUser.attempt >= 5 ){
            verifyUser.attempt = 0; 
            verifyUser.lastLogin = new Date();
            await this.userdb.updateOne({_id:verifyUser._id},verifyUser);
        }
        if(((new Date().getTime() - verifyUser.lastLogin.getTime()) / 60 / 1000) <= 2 && verifyUser.attempt >= 5 )
           throw new Error ("Trop de tentative sur l'email "+verifyUser.email+  " (5 max) - Veuillez patienter (2min)")

        const comparePasswords = await comparePass(password,verifyUser.password)
        if (!comparePasswords){
            verifyUser.lastLogin = new Date();
            verifyUser.attempt +=1;
            await this.userdb.updateOne({_id:verifyUser._id},verifyUser);
            throw new Error ('Email/password incorrect');
        }
        verifyUser.lastLogin = new Date();
        verifyUser.attempt = 0;
        await this.userdb.updateOne({_id:verifyUser._id},verifyUser);

        return verifyUser;
    }

    static async AuthTokenGenerator(user: UserInterfaces): Promise <string | void> {
        user.token = await getAuthToken(user);
        user.refreshToken = await getRefreshToken(user);
        await this.userdb.updateOne({_id: user._id}, user);
        return user.token;
    }

    static async Subscription(user: UserInterfaces, value: 0 | 1): Promise <void> {
        try {
            await this.userdb.updateOne({_id: user._id}, { $set:{ subscription: value }});
            await this.userdb.updateMany({parent_id: user._id}, { $set:{ subscription: value }});
        } catch (error) {
            console.log(error);
        }
    }
}