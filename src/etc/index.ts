import addServers from "./apidefUpdate";
import generateIPAddress from "./networking";
import makeBaseURL from "./serverlinking";
export async function getIPAddress() {
    const { server0, PORT } = await generateIPAddress();
    return { server0, PORT };
}

export async function createServerLinks() {
const baseURL: string = await makeBaseURL();
return baseURL;
}

export async function updateSpecDoc(){
    await addServers();
}