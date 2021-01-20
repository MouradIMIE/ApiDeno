import {compareCard, hash} from "../helpers/card.helpers.ts"
import {CardDatabase} from "../database/CardDatabase.ts"
import CardInterface from "../interfaces/CardInterace.ts";



export class CardModel extends CardDatabase implements CardInterface{
    
    _id: { $oid: string } | null = null;

    holderName: string;
    cartNumber: string;
    month: number;
    year: number;
    ccv: number;
    default: any;

    constructor(holderName: string, cartNumber : string, month : number , year : number, ccv: number){
        super();
        this.holderName = holderName;
        this.cartNumber = cartNumber;
        this.month = month;
        this.year = year;
        this.ccv = ccv;
    }
    get id(): null | string | undefined | {$oid: string}  {
        return (this._id === null) ? null : this._id;
    }
    async insert(): Promise<void> {
        const used = await this.CardDB.findOne({
            id : this._id
        });
        if(used)throw new Error ("La carte existe déjà");
        this.cartNumber = await hash(this.cartNumber);
        this._id = await this.CardDB.insertOne({
            holderName: this.holderName, 
            cartNumber: this.cartNumber,
            month: this.month,
            year: this.year,
            ccv: this.ccv
        });
    }
    delete(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}