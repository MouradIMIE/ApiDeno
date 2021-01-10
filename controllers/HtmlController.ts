import { Request,Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import {HTMLResponse} from "../public/index.ts"
import {HTMLError} from "../public/error.ts"


export class HtmlController {

    static getHtml = async(req: Request, res: Response) => {
        try{
            const body = HTMLResponse
            res.setStatus(200).send(body);
        }catch {
            res.setStatus(404).send(HTMLError);
        }
    }
}

