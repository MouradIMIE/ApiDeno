import SongDatabase from "../database/SongDatabase.ts";
import { db } from "../database/database.ts";
import SongInterfaces from "../interfaces/SongInterface.ts";
import { Bson } from "https://deno.land/x/mongo@v0.20.1/mod.ts";

export class SongModel extends SongDatabase implements SongInterfaces {
  private songdb: any;
  private static songdb = db.collection<SongInterfaces>("songs");

  _id?: { $oid: string } | string | null;
  name: string;
  cover: string;
  url: string;
  type: string;
  time: string;
  createdAt: Date;
  updateAt: Date;

  constructor(name:string,cover:string,url:string,type:string,time:string){
    super();
    this.name = name;
    this.cover = cover;
    this.url = url;
    this.type = type;
    this.time = time;
    this.createdAt = new Date();
    this.updateAt = new Date();
  }

  async insert() : Promise <void>{
      this._id = await this.songdb.insertOne({
        name: this.name,
        cover : this.cover,
        url : this.url,
        ype : this.type,
        time : this.time,
        createdAt : this.createdAt,
        updateAt : this.updateAt,
      });
  }
}
