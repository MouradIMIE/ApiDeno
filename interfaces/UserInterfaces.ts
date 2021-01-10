import { roleTypes } from '../types/roleTypes.ts';
import { userUpdateType } from "../types/userUpdateType.ts";

export default interface UserInterfaces {
     //Interface utilisateur renseignement de tout les champs pouvant être pris en compte

    _id: { $oid: string }|null|string;

    firstname: string;
    lastname: string;
    sexe:string;
    email: string;
    password: string;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
    subcription: number;
    role: roleTypes;

    fullName(): string;
    getEmail(): string;
    insert(): Promise<void> ;
    update(update: userUpdateType): Promise < any > ;
    delete(): Promise < any > ;
}