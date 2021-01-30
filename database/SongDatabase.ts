import  {db}  from './database.ts';
import SongInterfaces from '../interfaces/SongInterface.ts';

export class UserDatabase{ 

    userdb: any;
    constructor(){
      this.userdb = db.collection< SongInterfaces >("Songs");   
    }
}