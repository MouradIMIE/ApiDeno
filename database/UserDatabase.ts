import  {db}  from './database.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';

export class UserDatabase{ 

    userdb: any;
    constructor(){
      this.userdb = db.collection< UserInterfaces >("users");   
    }
}