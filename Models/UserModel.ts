import { UserDB } from '../database/userDB.ts';
import  {roleTypes }  from '../types/roleTypes.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { hash } from '../helpers/password.helpers.ts';
import { userUpdateType } from "../types/userUpdateType.ts";

export class UserModels extends UserDB implements UserInterfaces {

    private _role: roleTypes = "Tutor";
    private id:{ $oid: string }|null = null;

    firstname: string;
    lastname: string;
    email: string;
    password: string;
    birthDate: Date;

    constructor(nom: string, prenom: string, email: string, password: string, birthDate: string) {
        super();
        
        this.firstname = prenom;
        this.lastname = nom;
        this.email = email;
        this.password = password;
        this.birthDate = new Date(birthDate);

    }

    get _id():string|null{
        return (this.id === null)?null: this.id.$oid;
    }

    get role():roleTypes{
        return this._role;
    }

    setRole(role: roleTypes): void {
        this._role = role;
        this.update({role: role});
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
            email: this.email,
            birthDate: this.birthDate,
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