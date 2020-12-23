import { BillDatabase } from "../database/BillDatabase";
import BillInterface from "../interfaces/BillInterface";

export class BillModel extends BillDatabase implements BillInterface{
    _id: string;
    _id_Stripe: string;
    date_payment: Date;
    montant_ht: string;
    montant_ttc: string;
    source: string;

    constructor(date_payment: Date, montant_ht : string, montant_ttc : string , source : string){
        super();
        this.date_payment = date_payment;
        this.montant_ht = montant_ht;
        this.montant_ttc = montant_ttc;
        this.source = source;
    }
    insert(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}