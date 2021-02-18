import { create, verify, decode, getNumericDate } from "https://deno.land/x/djwt@v2.0/mod.ts";
import { config } from '../config/config.ts';


const {
    JWT_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXP,
    JWT_REFRESH_TOKEN_EXP,
} = config;

const header: any = {
    alg: "none",
    typ: "JWT",
};

const getAuthToken = async (user: any) => {
    const payload: any = {
        id: user._id, 
        exp: getNumericDate(new Date().getTime() + parseInt(JWT_ACCESS_TOKEN_EXP)),
    };

    return (await create(header, payload, JWT_TOKEN_SECRET)).split('.')[1];
};

const getRefreshToken = async(user: any) => {
    const payload: any = {
        id: user._id,
        exp: getNumericDate(new Date().getTime() + parseInt(JWT_REFRESH_TOKEN_EXP)),
    };

    return (await create(header, payload, JWT_TOKEN_SECRET)).split('.')[1];
};

const getJwtPayload = async(token: string): Promise < any | null > => {
    try {
        console.log("--1")
        const jwtObject = await verify(token, JWT_TOKEN_SECRET, header.alg);
        if (jwtObject) {
            return jwtObject;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
};

export { getAuthToken, getRefreshToken, getJwtPayload };