import {createServerLinks} from "../../../etc";
//import { supportedCRS } from "../coreVariables";

export default async function init4feature(collectionId: string, featureId: string, context:any) {
    const  baseURL  = await createServerLinks();

    let sSideKeys: Array<string> = [];
    sSideKeys[0] = 'f';
    //Just list all active parameters

    //obj.params.query.crs === supportedCRS[0] ? sSideKeys.push('crs') : undefined;
    //obj.params.query['bbox-crs'] === supportedCRS[0] ? sSideKeys.push('bbox-crs') : undefined;

    //form querystring
    let queryParamString: string;
    //context.params.query.crs === supportedCRS[0] ? sSideKeys.push('crs') : undefined;
    for (const [key, value] of Object.entries(context.params.query)) {
        if (value !== undefined && !sSideKeys.includes(key)) {
            queryParamString += `&${key}=${encodeURIComponent(value as string | number | boolean)}`
        }
    }

    let fKeys = {
        self_F: undefined,
        alt_F: undefined,
        self_type: undefined,
        alt_type: undefined
    };
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
    const links: Array<object> = [

        {
            href: `${baseURL}/collections/${collectionId}/items/${featureId}?f=${fKeys.self_F}` + queryParamString,
            rel: "self",
            type: `${fKeys.self_type}`,
            title: `This document as ${fKeys.self_F}`
        },
        {
            href: `${baseURL}/collections/${collectionId}/items/${featureId}?f=${fKeys.alt_F}` + queryParamString,
            rel: "alternate",
            type: `${fKeys.alt_type}`,
            title: `This document as ${fKeys.alt_F}`
        },
        {
            href: `${baseURL}/collections/${collectionId}f=json`,
            rel: "collection",
            type: "application/json",
            title: `${collectionId} collection Document`
        },
        {
            href: `${baseURL}/collections/${collectionId}/items?f=json`,
            rel: "items",
            type: "application/geo+json",
            title: `${collectionId} items`
        }
    ];
    return links;
}