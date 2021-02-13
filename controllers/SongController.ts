import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { play } from "https://deno.land/x/audio@0.1.0/mod.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { UserModels } from "../Models/UserModel.ts";
import { SongModel } from "../Models/SongModel.ts";
import { Bson } from "https://deno.land/x/mongo@v0.21.0/mod.ts";
import SongInterfaces from "../interfaces/SongInterface.ts";


export class SongController {

    static createSong = async(req :Request, res: Response) => {
        try{
            const {name,cover,url,type,time} = req.body;
            if(!name || !cover || !url || !type || !time ) throw new Error('Une ou plusieurs données obligatoire sont manquantes');
            const song = new SongModel(name,cover,url,type,time);
            await song.insert();
            
            res.status = 200;
            return res.json({
                error: false,
                message: 'Le son à bien été ajouté', 
                song: [{
                    id: song.idSong,
                    name: song.name,
                    url: song.url,
                    cover: song.cover,
                    time: song.time,
                    type: song.type,
                    createdAt: song.createdAt,
                    updateAt: song.updateAt }] 
                })
        }
        catch(error){
            if (error.message === 'Une ou plusieurs données obligatoire sont manquantes'){
                res.status = 400;
                res.json({error: true, message : error.message});
            }if (error.message === 'Une ou plusieurs données sont erronées'){
                res.status = 409;
                res.json({error: true, message : error.message});
            }
        }
    }
    


    static getSong = async(req: Request, res: Response) => {
        try { 
            const getReqUser: any = req;
            const payload: any = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : new Bson.ObjectID(payload.id)
            })
            const id = req.originalUrl.slice(7);
            const Song: SongInterfaces|undefined =  await SongModel.songdb.findOne({
                idSong:parseInt(id)
            });
    
            if(!Song) throw new Error ("idSong incorrect");
            if(user){
                if(user.subscription !== 1 ) throw new Error ("Vos droits d'accès ne permettent pas d'accéder à la ressource");
                play(Song.url);
                res.status = 200
                return res.json({
                error: false, 
                songs: [{
                    id: Song.idSong,
                    name: Song.name,
                    url: Song.url,
                    cover: Song.cover,
                    time: Song.time,
                    type: Song.type,
                    createdAt: Song.createdAt,
                    updateAt: Song.updateAt }] 
                })
            }
        } 
        catch (error) {
            if(error.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }if (error.message === "Votre token n'est pas correct"){
                res.status = 401;
                res.json({error: true, message : error.message});
            }
            if (error.message === "idSong incorrect"){
                res.status = 401;
                res.json({error: true, message : error.message});
            }
        }
    }
    
    static getSongs = async(req: Request, res: Response) => {
        try{
            const getReqUser: any = req;
            const payload: any = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : new Bson.ObjectID(payload.id)
            })
            if(user){
                if(user.subscription !== 1 ) throw new Error ("Vos droits d'accès ne permettent pas d'accéder à la ressource");
                const songs = await SongModel.songdb.find().toArray();
                res.status = 200;
                return res.json({
                    error : false,
                    songs : songs
                });
            }
        }
        catch(error){
            if(error.message === "Votre abonnement ne permet pas d'accéder à la ressource"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }
        }
    }
}