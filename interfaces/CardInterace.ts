export default interface CardInterface{
    _id: { $oid: string } | null | string;
    holderName: string;
    cartNumber : string;
    month : string;
    year: string;
    ccv: string;
    default: boolean;

    insert(): Promise<void>;
    delete(): Promise<any>;
}