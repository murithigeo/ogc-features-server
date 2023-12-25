import { supportedCRS, contentNegotiationVals, SupportedContentTypes } from "./coreVars";
import { createServerLinks } from "../../core/serverlinking";

async function detLinks(
    obj: any, //The context obj
    defContentType: string, //The default content type. Default is application/json or application/geo+json
    altContentType: string, //The alternate content type. Default is text/html
    defF: string, altF: string //The default and alternate f values. Default is json and html
) {
    const selfConType = obj.params.query.f === defF ? defContentType : altContentType; ///The content type of the self link
    const altConType = obj.params.query.f === defF ? altContentType : defContentType; //The content type of the alternate link
    const selfF = obj.params.query.f === defF ? defF : altF; //The f value of the self link
    const alternateF = obj.params.query.f === defF ? altF : defF; //The f value of the alternate link

    return { selfConType, altConType, selfF, alternateF }
}

export async function createLinks4FeatureCollection(collectionId: string, obj: any, offset: number, numberMatched: number, prevPageOffset: number, nextPageOffset: number) {
    const { baseURL } = await createServerLinks();

    const { selfConType, altConType, selfF, alternateF } = await detLinks(obj,
        SupportedContentTypes[1], //
        SupportedContentTypes[2],
        contentNegotiationVals[0],
        contentNegotiationVals[1]);



    let hasNextPage: boolean, hasPrevPage: boolean;
    offset < 1 || numberMatched == 0 ? hasPrevPage = false : hasPrevPage = true;
    numberMatched < 1 || numberMatched == 1 ? hasNextPage = false : hasNextPage = true;

    let sSideKeys: Array<string> = [];
    sSideKeys[0] = 'offset'
    sSideKeys[1] = 'f';

    /**
     * Add @crs & @bboxcrs to ignoreKeys array if they are the default. The server assumes that 
     * in absence of definition, they are CRS84
     */
    obj.params.query.crs === supportedCRS[0] ? sSideKeys.push('crs') : undefined;
    obj.params.query['bbox-crs'] === supportedCRS[0] ? sSideKeys.push('bbox-crs') : undefined;
    let queryParamString = '';
    for (const [key, value] of Object.entries(obj.params.query)) {
        if (value !== undefined && !sSideKeys.includes(key)) {
            queryParamString += `&${key}=${encodeURIComponent(value as string | number | boolean)}`
        }
    }
    const links: Array<any> = [
        {
            rel: "self",
            href: `${baseURL}/collections/${collectionId}/items?f=${selfF}&offset=${offset}` + queryParamString,
            type: `${selfConType}`,
            title: "This document as GeoJSON"
        },
        {
            rel: "alternate",
            href: `${baseURL}/collections/${collectionId}/items?f=${alternateF}&offset=${offset}` + queryParamString,
            type: `${altConType}`,
            title: "This document as HTML"
        }
    ];
    hasNextPage == true ? links.push({
        rel: "next",
        href: `${baseURL}/collections/${collectionId}/items?f=${selfF}&offset=${nextPageOffset}` + queryParamString,
        type: `${selfConType}`,
        title: "The next page of results"
    }) : links;
    hasPrevPage == true ? links.push({
        rel: "prev",
        href: `${baseURL}/collections/${collectionId}/items?f=${selfF}&offset=${prevPageOffset}` + queryParamString,
        type: `${altConType}`,
        title: "The previous page of results"
    }) : links;
    return links;
}

export async function createLinks4Collections(collectionId: string) {

    const { baseURL } = await createServerLinks();
    const links: Array<object> = [
        {
            rel: "self",
            title: `${collectionId} collection`,
            type: "application/json",
            href: `${baseURL}/collections/${collectionId}`
        },
        {
            rel: "items",
            title: `${collectionId} items`,
            type: "application/geo+json",
            href: `${baseURL}/collections/${collectionId}/items?f=json`
        },
        {
            rel: "alternate",
            title: `${collectionId} items`,
            type: "text/html",
            href: `${baseURL}/collections/${collectionId}/items?f=html`
        },
        {
            rel: "alternate",
            title: `${collectionId} items`,
            type: "application/json",
            href: `${baseURL}/collections/${collectionId}/items?f=json`
        },
        {
            rel: "enclosure",
            title: `${collectionId} download`,
            type: "application/geopackage+sqlite3",
            href: `${baseURL}/download/${collectionId}.gpkg`
        }
    ];
    return links;
}

export async function createLinks4CollectionDoc() {
    const { baseURL } = await createServerLinks();
    const links: Array<object> = [
        {
            rel: "self",
            title: "This document as JSON",
            type: "application/json",
            href: `${baseURL}/collections`
        },
        {
            rel: "alternate",
            title: "This document as HTML",
            type: "text/html",
            href: `${baseURL}/collections?f=html`
        }
    ];
    return links;
}

export async function createLinks4Feature(collectionId: string, featureId: string, obj) {
    const { baseURL } = await createServerLinks();
    const { selfConType, altConType, selfF, alternateF } = await detLinks(
        obj,
        SupportedContentTypes[1], //Default is application/geo+json
        SupportedContentTypes[2], //Alternate is text/html
        contentNegotiationVals[0], //Default is json
        contentNegotiationVals[1] //Alternate is html
    );
    let sSideKeys: Array<string> = [];
    sSideKeys[0] = 'f'
    obj.params.query.crs === supportedCRS[0] ? sSideKeys.push('crs') : undefined;
    obj.params.query['bbox-crs'] === supportedCRS[0] ? sSideKeys.push('bbox-crs') : undefined;
    let queryParamString: string;
    obj.params.query.crs === supportedCRS[0] ? sSideKeys.push('crs') : undefined;
    for (const [key, value] of Object.entries(obj.params.query)) {
        if (value !== undefined && !sSideKeys.includes(key)) {
            queryParamString += `&${key}=${encodeURIComponent(value as string | number | boolean)}`
        }
    }
    const links: Array<object> = [
        {
            href: `${baseURL}/collections/${collectionId}/items/${featureId}?f=${selfF}` + queryParamString,
            rel: "self",
            type: `${selfConType}`,
            title: "This document as GeoJSON"
        },
        {
            href: `${baseURL}/collections/${collectionId}/items/${featureId}?f=${alternateF}` + queryParamString,
            rel: "alternate",
            type: `${altConType}`,
            title: "This document as HTML"
        },
        {
            href: `${baseURL}/collections/${collectionId}`,
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

export async function createLinks4Conformance() {
    const { baseURL } = await createServerLinks();
    const links: Array<any> = [
        {
            rel: "self",
            title: "This document as JSON",
            type: "application/json",
            href: `${baseURL}/conformance`
        },
        {
            rel: "alternate",
            title: "This document as HTML",
            type: "text/html",
            href: `${baseURL}/conformance?f=html`
        }
    ];
    return links;
}

export async function createLinks4LandingPage() {
    const { baseURL } = await createServerLinks();
    const links: Array<object> = [
        {
            rel: 'self',
            type: 'application/json',
            href: `${baseURL}/`,
            title: 'This Document'
        },
        {
            rel: 'conformance',
            href: `${baseURL}/conformance`,
            type: 'application/json'
        },
        {
            rel: 'service-desc',
            type: 'application/vnd.oai.openapi+json;version=3.0',
            href: `${baseURL}/api`
        },
        {
            rel: 'service-doc',
            type: 'text/html',
            href: `${baseURL}/api.html`
        },
        {
            rel: 'data',
            type: 'application/json',
            href: `${baseURL}/collections`,
            title: 'collectionsDocument'
        }
    ];
    return links
}