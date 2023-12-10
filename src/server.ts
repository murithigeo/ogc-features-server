import { getIPAddress } from "./core/networking";
import { createServerLinks } from "./core/serverlinking";
import * as connect from "connect";
import * as path from "path";
import * as http from "http";
import * as exegesisExpress from "exegesis-express";
import * as fs from 'fs';
import * as morgan from "morgan";
import { addServers } from "./core/serversArraying";

async function createServer() {
    const options = {
        controllers: path.resolve(__dirname, './controllers'),
        controllersPattern: "**/*.@(ts|js)",
        ignoreServers: false
    };
    const exegesisMiddleware = await exegesisExpress.middleware(
        path.resolve(__dirname, './openapi.yaml'),
        options
    );
    const app = connect();
    const accessLogStream = fs.createWriteStream(
        path.join(__dirname, "./logs/reqs.log"),
        { flags: "a" }
    );
    app.use(morgan("combined", { stream: accessLogStream }));
    app.use(exegesisMiddleware);
    const server = http.createServer(app);
    return server;
}

async function initServer() {
    const { serverIP, PORT } = await getIPAddress();
    const { baseURL } = await createServerLinks();
    await addServers();
    createServer()
        .then(
            server => {
                server.listen(PORT);
                console.log("Server is listening at: http://" + serverIP + ':' + PORT);
                console.log("To test against OGC Test Suite, paste the following link into TeamEngine:" + baseURL + '/');
                console.log("View documentation at: " + baseURL + '/api.html');
            }
        ).catch(err => {
            console.error(err.stack);
            process.exit(1);
        });

}
initServer();