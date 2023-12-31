import { getIPAddress } from "./";

export default async function makeBaseURL() {
    const locationText: string = "";
    let addPort: string;
    //let baseURL: string;
    const { server0, PORT } = await getIPAddress();
    PORT === 80 ? addPort = "" : addPort = ":" + PORT;

    const baseURL: string = "http://" + server0 + addPort + locationText;
    //const baseURL2 = "http://localhost" + addPort + locationText;
    return baseURL;
};