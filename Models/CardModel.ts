import {CardDatabase} from "../database/CardDatabase.ts"
import CardInterface from "../interfaces/CardInterace.ts";



export class CardModel extends CardDatabase implements CardInterface{
    
    _id: { $oid: string } | null = null;

    idCarte: number;
    holderName: string;
    cartNumber: number;
    month: number;
    year: number;
    ccv: number;
    default: boolean;
    static CardDB: any;

    constructor(holderName: string, cartNumber : number, month : number , year : number, ccv: number){
        super();
        this.idCarte = 0;
        this.holderName = holderName;
        this.cartNumber = cartNumber;
        this.month = month;
        this.year = year;
        this.ccv = ccv;
        this.default = true;
    }
    get id(): null | string | undefined | {$oid: string}  {
        return (this._id === null) ? null : this._id;
    }
    IDCarte(idCarte: number ){
        idCarte = this.idCarte + 1;
    }
    async insert(): Promise<void> {
        const card : CardInterface | undefined = await this.CardDB.findOne({idCarte: this.idCarte})
        if(card?.idCarte === this.idCarte) { this.idCarte = this.idCarte +1}
        const verifyCard : CardInterface  = await this.CardDB.findOne({
            cartNumber : this.cartNumber
        });
        if(verifyCard)throw new Error ("La carte existe déjà");
        this._id = await this.CardDB.insertOne({
            idCarte: this.IDCarte(this.idCarte),
            holderName: this.holderName, 
            cartNumber: this.cartNumber,
            month: this.month,
            year: this.year,
            ccv: this.ccv,
            default: this.default
        });
    }
    delete(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}


