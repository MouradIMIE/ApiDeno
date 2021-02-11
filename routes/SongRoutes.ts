import { SongController } from "../controllers/SongController.ts";
import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Application } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { AuthMiddlewares } from "../middlewares/AuthMiddlewares.ts";


const route: Application = opine();

route.post('/', AuthMiddlewares, SongController.createSong);
route.get('/',AuthMiddlewares, SongController.getSongs);
route.get('/:id',AuthMiddlewares, SongController.getSong);

export { route as SongRoutes };