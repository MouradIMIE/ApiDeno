export default interface BillInterface{
    _id?: { $oid: string } | string | null;
    user_id: { $oid: string } | string | undefined;
    id_Stripe:string;
    date_payment : Date | string;
    montant_ht : number;
    montant_ttc: number;
    source: string;
    createdAt: Date;
    updateAt:Date;


}