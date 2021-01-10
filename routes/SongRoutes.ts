import { SongController } from "../controllers/SongController.ts";
import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Application } from "https://deno.land/x/opine@1.0.2/src/types.ts";


const route: Application = opine();

route.get('/', SongController.getSongs);
route.get('/:id', SongController.getSong);

export { route as SongRoutes };