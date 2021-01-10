import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Route } from "./routes/Routes.ts";
import { getAuthToken, getRefreshToken, getJwtPayload }  from './helpers/jwt.helpers.ts';
import {UserModels} from "./Models/UserModel.ts"

const app = opine();
app.use(Route);
app.listen({port: 8080});

let userTest = new UserModels ('yani','ufv','oui','ydh','gfd','1995-12-11')
userTest.insert()
console.log(userTest)

console.log("Server is up and running");