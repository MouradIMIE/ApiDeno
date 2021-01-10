import { opine } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { UserRoutes } from "./UserRoutes.ts";
import { SongRoutes } from "./SongRoutes.ts";
import { BillRoutes } from './BillRoutes.ts';
import {HtmlRoute} from './HtmlRoutes.ts';


const route = opine();

route.use('/',HtmlRoute);
route.use('/', UserRoutes);
route.use('/songs', SongRoutes);
route.use('/bills', BillRoutes);

export { route as Route };