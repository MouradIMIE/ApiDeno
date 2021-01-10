import { UserDatabase } from '../database/UserDatabase.ts';
import  {roleTypes }  from '../types/roleTypes.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { hash } from '../helpers/password.helpers.ts';
import { userUpdateType } from "../types/userUpdateType.ts";

export class UserModels extends UserDatabase implements UserInterfaces {

    private _role: roleTypes = "Tutor";
    private subscription: number = 0 ;
    private id:{ $oid: string }|null = null;

    firstname: string;
    lastname: string;
    sexe: string;
    email: string;
    password: string;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
    userdb: any;

    constructor(nom: string, prenom: string, sexe: string, email: string, password: string, birthDate: string) {
        super();
        
        this.firstname = prenom;
        this.lastname = nom;
        this.sexe = sexe
        this.email = email;
        this.password = password;
        this.birthDate = new Date(birthDate);
        this.createdAt = new Date();
        this.updatedAt = new Date();

    }

    get _id():string|null{
        return (this.id === null)?null: this.id.$oid;
    }

    get role():roleTypes{
        return this._role;
    }
    get subcription():number|0{
        return this.subscription;
    }
    
    setRole(role: roleTypes): void {
        this._role = role;
        this.update({role: role});
    }
    setSubcription(subscription: number): void {
        this.subscription = subscription;
        this.update({subscription: subscription});
    }
    
    
    fullName(): string {
        return `${this.lastname} ${this.firstname}`;
    }
    getEmail(): string {
        return ` ${this.email}`;
    }
    async insert(): Promise<void> {
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
            subscription: this.subscription,
        });
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