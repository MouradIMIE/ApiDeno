import { db } from "../database/database.ts";
import {SongDatabase} from "../database/SongDatabase.ts";
import SongInterfaces from "../interfaces/SongInterface.ts";

export class SongModel extends SongDatabase implements SongInterfaces {

  _id?: { $oid: string } | string | null;
  idSong: number;
  name: string;
  cover: string;
  url: string;
  type: string;
  time: string;
  createdAt: Date;
  updateAt: Date;
  static songdb: any;
  

  constructor(name:string,cover:string,url:string,type:string,time:string){
    super();
    this.idSong = 0;
    this.name = name;
    this.cover = cover;
    this.url = url;
    this.type = type;
    this.time = time;
    this.createdAt = new Date();
    this.updateAt = new Date();
  }
  
  async insert() : Promise <void>{
    const Song : SongInterfaces | undefined = await this.songdb.findOne({idSong: this.idSong})
    if(Song?.idSong === this.idSong) { this.idSong = Song.idSong +1}
      this._id = await this.songdb.insertOne({
        idSong: this.idSong,
        name: this.name,
        cover : this.cover,
        url : this.url,
        type : this.type,
        time : this.time,
        createdAt : this.createdAt,
        updateAt : this.updateAt,
      });
  }
}