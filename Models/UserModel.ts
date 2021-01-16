import { UserDatabase } from '../database/UserDatabase.ts';
import  {roleTypes }  from '../types/roleTypes.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { comparePass, hash } from '../helpers/password.helpers.ts';
import { userUpdateType } from "../types/userUpdateType.ts";
import { sexeTypes } from '../types/sexeTypes.ts';
import {db} from '../database/database.ts'
import { compare } from "https://deno.land/x/bcrypt@v0.2.4/src/main.ts";

export class UserModels extends UserDatabase implements UserInterfaces {

    private _role: roleTypes = "Tutor";
    private id:{ $oid: string }|null = null;

    firstname: string;
    lastname: string;
    sexe: sexeTypes;
    email: string;
    password: string;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
    subscription: number;
    lastLogin: Date;
    attempt: number;
    userdb: any;
    static userdb = db.collection <UserInterfaces> ("users");

    constructor(nom: string, prenom: string, sexe: sexeTypes, email: string, password: string, birthDate: string) {
        super();
        
        this.firstname = prenom;
        this.lastname = nom;
        this.sexe = sexe;
        this.email = email;
        this.password = password;
        this.birthDate = new Date(birthDate);
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.lastLogin = new Date();
        this.attempt = 0;
        this.subscription = 0;

    }

    get _id():string|null{
        return (this.id === null)?null: this.id.$oid;
    }

    get role():roleTypes{
        return this._role;
    }
    get subcription():number{
        return this.subscription;
    }
    
    setRole(role: roleTypes): void {
        this._role = role;
        this.update({role: role});
    }
   /* setSubcription(subscription: number): void {
        this.subscription = subscription;
        this.update({subscription: subscription});
    }
    
    fullName(): string {
        return `${this.lastname} ${this.firstname}`;
    }
    getEmail(): string {
        return ` ${this.email}`;
    }*/
    async insert(): Promise<void> {
        const used = this.userdb.findOne({
            email: this.email
        });
        if(used)throw new Error ("Un compte utilisant cette adresse mail est déjà enregistré");
        this.password = await hash(this.password);
        this.id = await this.userdb.insertOne({
            role: this._role,
            firstname: this.firstname,
            lastname: this.lastname,
            sexe: this.sexe,
            password:this.password,
            email: this.email,
            birthDate: this.birthDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: new Date(),
            attempt: this.attempt,
            subscription: this.subscription,
        });
    }

    static async login(email :string, password:string): Promise < UserInterfaces >{
        
        // Créer un user qui vérifie la présence de cet email dans la db 
        const verifyUser: UserInterfaces | undefined   = await this.userdb.findOne({email:email});

        //Si aucun utilisateur a ce mail ça fait une erreur 
        if (!verifyUser) throw new Error("Email/password incorrect") 

        //Vérifier le nbr de co et le temps depuis la last co
        if(((new Date().getTime() - verifyUser.lastLogin.getTime()) / 60 / 1000) >= 2 && verifyUser.attempt >= 5 ){
            // Si l'user à attendu 2 minutes depuis sa last connection, on remet à 0
            verifyUser.attempt = 0; 
            verifyUser.lastLogin = new Date();
            this.userdb.updateOne({id:verifyUser._id},verifyUser);
        }
        // On vérifie le nbr de co et le temps depuis la last co
        if(((new Date().getTime() - verifyUser.lastLogin.getTime()) / 60 / 1000) <= 2 && verifyUser.attempt >= 5 ){
            new Error ("Trop de tentative sur l'email"+verifyUser.email+  "(5 max) - Veuillez patienter (2min)")
        }

        const comparePasswords = await comparePass(password,verifyUser.password)
        if (!comparePasswords){
            verifyUser.lastLogin = new Date();
            verifyUser.attempt +=1;
            this.userdb.updateOne({id:verifyUser._id},verifyUser);
            throw new Error ('Email/password incorrect');
        }
        // Si user a respecté 2 min on remet tout à 0
        verifyUser.lastLogin = new Date();
        verifyUser.attempt = 0;
        this.userdb.updateOne({id:verifyUser._id},verifyUser);

        return verifyUser;
    }

    async update(update: userUpdateType): Promise < any > {
        const { modifiedCount, upsertedId } = await this.userdb.updateOne(
            { _id:  this.id },
            { $set: update }
          );
          
    }
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}