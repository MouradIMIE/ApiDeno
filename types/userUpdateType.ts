import{roleTypes} from './roleTypes.ts';

export type  userUpdateType = {
    
    lastname?: string;
    firstname?: string;
    email?: string;
    password?: string;
    birthDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    subscription?: number;
    role?: roleTypes;
}

