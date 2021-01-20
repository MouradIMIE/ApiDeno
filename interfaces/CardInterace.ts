export default interface CardInterface{
    _id: { $oid: string } | null | string;
    holderName: string;
    cartNumber : string;
    month : number;
    year: number;
    ccv: number;
    default: any;

    insert(): Promise<void>;
    delete(): Promise<any>;
}