import  {db}  from './database.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { userUpdateType } from "../types/userUpdateType.ts";

export class UserDatabase{ 

    userdb: any;
    constructor(){
      this.userdb = db.collection< UserInterfaces >("users");   
    }
    insert(): Promise < any > {
        throw new Error('Method not implemented.');
    }
    update(update: userUpdateType): Promise < any > {
        throw new Error('Method not implemented.');
    }   
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}