import { BillController } from "../controllers/BillController.ts";
import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Application } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import {AuthMiddlewares} from "../middlewares/AuthMiddlewares.ts";

const route: Application = opine();

route.get('/', AuthMiddlewares ,BillController.getBill);

export { route as BillRoutes }