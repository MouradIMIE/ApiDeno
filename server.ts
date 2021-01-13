import { opine , urlencoded  } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Route } from "./routes/Routes.ts";
import { getAuthToken, getRefreshToken, getJwtPayload }  from './helpers/jwt.helpers.ts';


const app = opine();
app.use(Route , urlencoded());
app.listen({port: 8080});


console.log("Server is up and running");