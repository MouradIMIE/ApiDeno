import { config } from '../config/config.ts';
import { MongoClient } from "https://deno.land/x/mongo@v0.20.1/mod.ts";

const API_DATABASE = new MongoClient();
await API_DATABASE.connect(config.DB_URL);

const db = API_DATABASE.database("API_DENO");

export default db;