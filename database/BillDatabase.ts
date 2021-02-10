import BillInterface from "../interfaces/BillInterface.ts";
import {db} from "./database.ts"

export class BillDatabase{
    
    BillDB : any;

    constructor(){
        this.BillDB = db.collection<BillInterface>("Payment");
    }
}