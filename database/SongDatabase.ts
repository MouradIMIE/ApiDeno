import  {db}  from './database.ts';
import SongInterfaces from '../interfaces/SongInterface.ts';

export class SongDatabase{ 

    songdb: any;
    constructor(){
      this.songdb = db.collection< SongInterfaces >("Songs");   
    }
}