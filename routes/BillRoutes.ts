import { BillController } from "../controllers/BillController.ts";
import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Application } from "https://deno.land/x/opine@1.0.2/src/types.ts";


const route: Application = opine();

route.get('/', BillController.getBill);

export { route as BillRoutes }