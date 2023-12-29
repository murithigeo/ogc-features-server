import { getIPAddress } from "./networking";

export default async function createServerLinks() {
    const locationText: string = "";
    let addPort: string;
    //let baseURL: string;
    const { server0, PORT } = await getIPAddress();
    PORT === 80 ? addPort = "" : addPort = ":" + PORT;

    const baseURL = "http://" + server0 + addPort + locationText;
    //const baseURL2 = "http://localhost" + addPort + locationText;
    return {baseURL};
};