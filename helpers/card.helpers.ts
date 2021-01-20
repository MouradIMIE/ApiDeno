import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const hash = async(cartNumber: string):Promise<string>=>{
    return await bcrypt.hash(cartNumber);
}

const compareCard = async(cartNumber: string, hash: string):Promise<boolean> =>{
    return await bcrypt.compare(cartNumber, hash);
}

export { hash, compareCard };