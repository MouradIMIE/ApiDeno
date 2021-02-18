import { BillDatabase } from "../database/BillDatabase.ts";
import BillInterface from "../interfaces/BillInterface.ts";
import {db} from "../database/database.ts";
import { Bson } from "https://deno.land/x/mongo@v0.21.0/mod.ts";

export class BillModel extends BillDatabase implements BillInterface{
    
    _id?: { $oid: string } | string | null;
    user_id: string;
    id_Stripe:string;
    date_payment : Date | string;
    montant_ht : number;
    montant_ttc: number;
    source: string;
    createdAt: Date;
    updateAt:Date;
    BillDB: any;
    static BillDB = db.collection < BillInterface > ("Payment");

    constructor(user_id : string, id_Stripe : string, date_payment: Date, montant_ht : number,montant_ttc: number, source: string ){
        super();
        this.user_id = user_id;
        this.id_Stripe = id_Stripe;
        this.date_payment = new Date(date_payment);
        this.montant_ht = montant_ht;
        this.montant_ttc = montant_ttc;
        this.source = source;
        this.createdAt =  new Date();
        this.updateAt = new Date();
    }

    async insert(): Promise<void> {
        this._id = await this.BillDB.insertOne({
            user_id : new Bson.ObjectId(this.user_id),
            id_Stripe : this.id_Stripe,
            date_payment : this.date_payment,
            montant_ht : this.montant_ht,
            montant_ttc : this.montant_ttc,
            source : this.source,
            createdAt: this.createdAt,
            updateAt: this.updateAt,
        });
    }

    static async getBills(user_id: string): Promise <BillInterface[]> {
        const bills = await this.BillDB.find({user_id: user_id}).toArray();
        bills.map((item) => {
            Object.assign(item, {id: item._id});
            const date = <Date>(item.date_payment);
            item.date_payment = formatPayementDate(date);
            delete item._id;
            delete item.user_id;
        });
        if (bills) return bills;
        else return [];
    }
}
export const formatPayementDate = (date: Date) => {
    return date.getUTCFullYear() + '-' + ((date.getUTCMonth() < 10) ? '0' + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1))  + '-' + ((date.getUTCDate() < 10) ? '0' + date.getUTCDate() : date.getUTCDate()) + ' ' + ((date.getUTCHours() < 10) ? '0' + (date.getUTCHours() + 1) : (date.getUTCHours() + 1))+ ':' + ((date.getUTCMinutes() < 10) ? '0' + date.getUTCMinutes() : date.getUTCMinutes())+ ':' + ((date.getUTCSeconds() < 10) ? '0' + date.getUTCSeconds() : date.getUTCSeconds())
}