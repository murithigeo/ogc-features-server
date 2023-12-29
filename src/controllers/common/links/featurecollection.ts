import createServerLinks from "../../../core/serverlinking";
import { supportedCRS } from "../core/global.variables";

let fKeys = {
    self_F: undefined,
    alt_F: undefined,
    self_type: undefined,
    alt_type: undefined,
};

export default async function init4featurecoll(collectionId: string,
    context: any,
    offset: number,
    remainingFeatures: number, //count without offset. Is offset-limit
    prevPageOffset: number,
    nextPageOffset: number) {
    const { baseURL } = await createServerLinks();

    context.params.query.f === undefined || context.params.query.f === 'json' ? fKeys = {
        self_F: 'json',
        alt_F: 'html',
        self_type: 'application/geo+json',
        alt_type: 'text/html'
    } : fKeys = {
        self_F: 'html',
        alt_F: 'json',
        self_type: 'text/html',
        alt_type: 'application/geo+json'
    }

    let hasNextPage: boolean, hasPrevPage: boolean;
    offset < 1 || remainingFeatures == 0 ? hasPrevPage = false : hasPrevPage = true;
    remainingFeatures < 1 || remainingFeatures == 1 ? hasNextPage = false : hasNextPage = true;

    let sSideKeys: Array<string> = [];
    sSideKeys[0] = 'offset'
    //sSideKeys[1] = 'f';

    /**
     * Add @crs & @bboxcrs to ignoreKeys array if they are the default. The server assumes that 
     * in absence of definition, they are CRS84
     */
    //context.params.query.crs === supportedCRS[0] ? sSideKeys.push('crs') : undefined;
    //context.params.query['bbox-crs'] === supportedCRS[0] ? sSideKeys.push('bbox-crs') : undefined;
    let queryParamString = '';
    for (const [key, value] of Object.entries(context.params.query)) {
        if (value !== undefined && !sSideKeys.includes(key)) {
            queryParamString += `&${key}=${encodeURIComponent(value as string | number | boolean)}`
        }
    }
    const links: Array<any> = [
        {
            rel: "self",
            href: `${baseURL}/collections/${collectionId}/items?f=${fKeys.self_F}&offset=${offset}` + queryParamString,
            type: `${fKeys.self_type}`,
            title: `Features as ${fKeys.self_F}`
        },
        {
            rel: "alternate",
            href: `${baseURL}/collections/${collectionId}/items?f=${fKeys.self_F}&offset=${offset}` + queryParamString,
            type: `${fKeys.alt_type}`,
            title: `Features ${fKeys.alt_F}`
        }
    ];
    hasNextPage == true ? links.push({
        rel: "next",
        href: `${baseURL}/collections/${collectionId}/items?f=${fKeys.self_F}&offset=${nextPageOffset}` + queryParamString,
        type: `${fKeys.self_type}`,
        title: "The next page of results"
    }) : links;
    hasPrevPage == true ? links.push({
        rel: "prev",
        href: `${baseURL}/collections/${collectionId}/items?f=${fKeys.self_F}&offset=${prevPageOffset}` + queryParamString,
        type: `${fKeys.self_type}`,
        title: "The previous page of results"
    }) : links;
    return links;
}