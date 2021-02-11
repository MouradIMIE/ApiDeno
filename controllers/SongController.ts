import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { play } from "https://deno.land/x/audio@0.1.0/mod.ts";
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { UserModels } from "../Models/UserModel.ts";
import { SongModel } from "../Models/SongModel.ts";
import { Bson } from "https://deno.land/x/mongo@v0.21.0/mod.ts"; 


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
            }
        }
    }
    


    static getSong = async(req: Request, res: Response) => {
        try { 
            await play('C:/Users/drogb/OneDrive/Bureau/IMIE/Deno_/ApiDeno/Audio/BoobaRatpiWorld.mp3');
            const getReqUser: any = req;
            const payload: any = getReqUser.user;
            const user : UserInterfaces|undefined = await UserModels.userdb.findOne({
                _id : new Bson.ObjectID(payload.id)
            })

            const id = req.originalUrl.slice(7);
            console.log(id);
            if(user){
                console.log(user);
                if(user.subscription === 0 ) throw new Error ("Vos droits d'accès ne permettent pas d'accéder à la ressource");
                const song = await SongModel.songdb.findOne({idSong: id});
                console.log(song+'-------'+user.subscription);
                res.status = 200
                return res.json({
                error: false, 
                songs: [{
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
        } 
        catch (error) {
            if(error.message === "Vos droits d'accès ne permettent pas d'accéder à la ressource"){
                res.status = 403;
                res.json({error: true, message : error.message});
            }if (error.message === "Votre token n'est pas correct"){
                res.status = 401;
                res.json({error: true, message : error.message});
            }
        }
    }


    static getSongs = async(req: Request, res: Response) => {

    }
}