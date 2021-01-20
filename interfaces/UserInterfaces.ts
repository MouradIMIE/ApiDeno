import { roleTypes } from '../types/roleTypes.ts';
import { sexeTypes } from '../types/sexeTypes.ts';
import { userUpdateType } from "../types/userUpdateType.ts";

export default interface UserInterfaces {
     //Interface utilisateur renseignement de tout les champs pouvant être pris en compte

    _id?: { $oid: string }|null|string;

    firstname: string;
    lastname: string;
    sexe:sexeTypes;
    email: string;
    password: string;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
    subscription: number;
    role: roleTypes;
    lastLogin: Date;
    attempt: number;

    token: string;
    refreshToken: string;
    
  /*fullName(): string;
    getEmail(): string;*/
    insert(): Promise<void> ;
    update(update: userUpdateType): Promise < any > ;
    delete(): Promise < any > ;
}