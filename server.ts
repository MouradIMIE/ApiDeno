import * as expressive from "https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts";
import { config } from "./config/config.ts";

const port = 8080;
const app = new expressive.App();

console.log(config);

const server = await app.listen(port);
console.log("app listening on port " + server.port);