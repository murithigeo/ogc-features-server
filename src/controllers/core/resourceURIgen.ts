import { createServerLinks } from '../../core/serverlinking';

export async function genBaseLink(obj) {
    const { baseURL } = await createServerLinks();
    const baseLink = baseURL;
    //const reqURL = `http://${obj.req.rawHeaders[1]}`;

    /*
    let baseLink: string;
    if (reqURL === baseURL) {
        baseLink = baseURL;
    } else if (reqURL === baseURL2) {
        baseLink = baseURL2
    }else if(reqURL!==baseURL && reqURL!==baseURL2){
        obj.res.status(503);
    }
    */
    return { baseLink };
}