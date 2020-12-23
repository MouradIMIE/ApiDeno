export default interface BillInterface{
    _id: string|null;
    _id_Stripe: string;
    date_payment : Date;
    montant_ht : string;
    montant_ttc: string;
    source: string;

    // Methods

    insert(): Promise<void>;
    delete(): Promise<any>;
}