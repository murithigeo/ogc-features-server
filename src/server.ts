import { getIPAddress } from "./core/networking";
import  createServerLinks from "./core/serverlinking";
import * as express from "express";
import  next from "next";
import * as path from "path";
import * as http from "http";
import * as exegesisExpress from "exegesis-express";
import * as fs from 'fs';
import * as morgan from "morgan";
//const dev = process.env.NODE_ENV !== 'production';

//const nextApp = next({ dev });
 
import { updateSpecDoc } from "./core/apidefUpdate";

async function createServer() {
    const options = {
        controllers: path.resolve(__dirname, './controllers/main'),
        controllersPattern: "**/*.@(ts|js)",
        ignoreServers: false
    };

    const exegesisMiddleware = await exegesisExpress.middleware(
        path.resolve(__dirname, './openapi.yaml'),
        options
    );
    const app = express();
  //  await nextApp.prepare();
    const accessLogStream = fs.createWriteStream(
        path.join(__dirname, "./logs/reqs.log"),
        { flags: "a" }
    );
    app.use(morgan("combined", { stream: accessLogStream }));

    app.use((req, res, next) => {
        req.url = decodeURIComponent(req.url);
        next();
    });

    app.use(exegesisMiddleware);
    const server = http.createServer(app);
    return server;
}

async function initServer() {
    const { server0, PORT } = await getIPAddress(); //Get the ServerIP and PORT params
    const { baseURL } = await createServerLinks(); //Get the formed serverUrl
    await updateSpecDoc(); //
    createServer()
        .then(
            server => {
                server.listen(PORT); //Alternatively, if you want,you can also listen on the specific IP address.
                console.log("Server is listening at: http://" + server0 + ':' + PORT);
                console.log("To test against OGC Test Suite, paste the following link into TeamEngine: " + baseURL + '/'); //landing page
                //console.log("To test against OGC Test Suite, paste the following link into TeamEngine: " + baseURL2 + '/');
                console.log("View documentation at: " + baseURL + '/api.html'); //api-docs page
            }
        ).catch(err => {
            console.error(err.stack);
            process.exit(1);
        });

}
initServer();