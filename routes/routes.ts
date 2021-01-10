import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import {db} from '../database/database.ts'

// const denoApiCollection = db.collection('API_DENO');

const login = (ctx : RouterContext) =>{
    ctx.response.body = 'Login successfuly';
}
export {login};