// import * as expressive from "https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { UserModels } from "./Models/UserModel.ts";
import { login } from "./routes/routes.ts";


const router = new Router();
router
    .get('/',(ctx) =>{
        ctx.response.body = 'Welcome to our API';
    })
    .post('/login',login)
    // .post('/register',register)
    // .put('/subscription',subscription)
    // .put('/user',user)
    // .delete('/user/off',deleteUser)
    // .post('/user/child',addChild)
    // .delete('/user/child',deleteChild)
    // .get('/user/child',displayChild)
    // .put('/user/cart',addCard)
    // .delete('/user',deleteAccount)
    // .get('/songs',listingAudios)
    // .get('/songs/{id}',listeningAudio)
    // .get('/bill',bill)

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({port: 8080});

let userTest = new UserModels ('yani','yani','yani','yani','1993-12-20')
  userTest.insert()
  console.log(userTest)
  
console.log("Server is up and running");