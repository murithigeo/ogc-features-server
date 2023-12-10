import { getIPAddress } from "./networking";

export async function createServerLinks() {
    const locationText: string = "";
    let addPort: string;
    //let baseURL: string;
    const { serverIP, PORT } = await getIPAddress();
    PORT === 80 ? addPort = "" : addPort = ":" + PORT;

    const baseURL = "http://" + serverIP + addPort + locationText;
    return {baseURL};
};