
import CardInterface from "../interfaces/CardInterace.ts";
import {db} from "./database.ts"

export class CardDatabase{
    
    CardDB : any;

    constructor(){
        this.CardDB = db.collection<CardInterface>("Payment");
    }
}