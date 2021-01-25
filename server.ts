import { opine, json, urlencoded } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Route } from "./routes/Routes.ts";
import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";

const __dirname = new URL('.', import.meta.url).pathname;

const app = opine();
app.use(json());
app.use(urlencoded());

app.get('/', (req: Request, res: Response)=> {
    try {   
        res.sendFile( __dirname.substring(1) + '/public/index.html');
    } catch (error) {
        res.sendFile(__dirname.substring(1) + '/public/error.html');
    }
    
});


app.use(Route);
app.listen({port: 8080});

  
console.log("Server is up and running");