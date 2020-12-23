import BillInterface from "../interfaces/BillInterface";
import db from "./database"

export class BillDatabase{
    BillDB : any;
    constructor(){
        this.BillDB = db.collection<BillInterface>("bills");
    }
}