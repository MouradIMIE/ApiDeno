import { roleTypes } from '../types/roleTypes.ts';
import { sexeTypes } from '../types/sexeTypes.ts';
import { userUpdateType } from "../types/userUpdateType.ts";
import { cardType } from "../types/cardType.ts"

export default interface UserInterfaces {
     //Interface utilisateur renseignement de tout les champs pouvant être pris en compte

    _id?: string|{ $oid: string }|null|undefined;
    parent_id:string|{$oid:string}|null|undefined;
    firstname: string;
    lastname: string;
    sexe:sexeTypes;
    email: string;
    password: string;
    birthDate: Date;
    card: Array<cardType>;
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
    // update(update: userUpdateType): Promise < any > ;
}