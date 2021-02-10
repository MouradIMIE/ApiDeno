import { BillDatabase } from "../database/BillDatabase.ts";
import BillInterface from "../interfaces/BillInterface.ts";

export class BillModel extends BillDatabase implements BillInterface{
    
    _id: { $oid: string } | null = null;
    _id_Stripe: { $oid: string } | null =null;

    date_payment : Date;
    montant_ht : number;
    montant_ttc: number;
    source: string;
    createdAt: Date;
    updateAt:Date;

    constructor(date_payment: Date, montant_ht : number,montant_ttc: number, source: string ){
        super();
    
        this.date_payment = date_payment;
        this.montant_ht = montant_ht;
        this.montant_ttc = montant_ttc;
        this.source = source;
        this.createdAt =  new Date();
        this.updateAt = new Date();
    }
    async insert(): Promise<void> {
        const insert = {
            date_payment: this.date_payment,
            montant_ht: this.montant_ht,
            montant_ttc: this.montant_ttc,
            source: this.source, 
            createdAt: this.createdAt,
            updateAt: this.updateAt,
        };
        await this.BillDB.insertOne(insert);
    }
    delete(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}