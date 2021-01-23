import { UserController } from "../controllers/UserController.ts";
import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Application } from "https://deno.land/x/opine@1.0.2/src/types.ts";
import { AuthMiddlewares } from "../middlewares/AuthMiddlewares.ts";
import { UserMiddlewares } from "../middlewares/UserMiddlewares.ts";

const route: Application = opine();

route.post('/login', UserController.login);
route.post('/register',UserMiddlewares, UserController.register);
route.post('/subscription', UserController.subscription);
route.put('/user',UserMiddlewares,AuthMiddlewares,UserController.editUser);
route.delete('/user/off',AuthMiddlewares,UserController.logout);
route.post('/user/child', UserController.createChild);
route.get('/user/childs', UserController.getChilds);
route.delete('/user/child', UserController.deleteChild);
route.put('/user/cart', UserController.addCart);
route.delete('/user', UserController.deleteUser);

export { route as UserRoutes };