export default interface CardInterface{
    _id: { $oid: string } | null | string;

    idCarte: number;
    holderName: string;
    cartNumber : number;
    month : number;
    year: number;
    ccv: number;
    default: boolean;

    insert(): Promise<void>;
    delete(): Promise<any>;
}