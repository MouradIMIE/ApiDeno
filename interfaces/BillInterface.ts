export default interface BillInterface{
    _id: { $oid: string } | null | string;
    _id_Stripe: { $oid: string } | null | string;
    
    date_payment : Date;
    montant_ht : number;
    montant_ttc: number;
    source: string;
    createdAt: Date;
    updateAt:Date;


    // Methods
    // A modifier au moment de la réalisation de la route de récupération d'une facture

    insert(): Promise<void>;
    delete(): Promise<any>;
}