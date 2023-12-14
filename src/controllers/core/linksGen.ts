import { genBaseLink } from "./resourceURIgen";

export async function genLinks4featurecollection(collectionId: string, prevPageOffset: number, nextPageOffset: number, limit: number, obj: any) {
    const { baseLink } = await genBaseLink(obj);
    const links: Array<any> = [
        {
            rel: "self",
            href: `${baseLink}/collections/${collectionId}/items?f=json`,
            type: "application/geo+json",
            title: "This document as GeoJSON"
        },
        {
            rel: "alternate",
            href: `${baseLink}/collections/${collectionId}/items?f=html`,
            type: "text/html",
            title: "This document as HTML"
        },
        {
            rel: "alternate",
            href: `${baseLink}/collections/${collectionId}/items?f=json`,
            type: "application/json",
            title: "This document as JSON"
        },
        {
            rel: "prev",
            href: `${baseLink}/collections/${collectionId}/items?f=json&offset=${prevPageOffset}&limit=${limit}`,
            type: "application/geo+json",
            title: "The previous page of results"
        },
        {
            rel: "next",
            href: `${baseLink}/collections/${collectionId}/items?f=json&offset=${nextPageOffset}&limit=${limit}`,
            type: "application/geo+json",
            title: "The next page of results"
        }
    ];
    return links;
}

export async function genLinks4collections(collectionId: string, obj) {

    const { baseLink } = await genBaseLink(obj);
    const links = [
        {
            rel: "self",
            title: `${collectionId} collection`,
            type: "application/json",
            href: `${baseLink}/collections/${collectionId}`
        },
        {
            rel: "items",
            title: `${collectionId} items`,
            type: "application/geo+json",
            href: `${baseLink}/collections/${collectionId}/items?f=json`
        },
        {
            rel: "alternate",
            title: `${collectionId} items`,
            type: "text/html",
            href: `${baseLink}/collections/${collectionId}/items?f=html`
        },
        {
            rel: "alternate",
            title: `${collectionId} items`,
            type: "application/json",
            href: `${baseLink}/collections/${collectionId}/items?f=json`
        },
        {
            rel: "enclosure",
            title: `${collectionId} download`,
            type: "application/geopackage+sqlite3",
            href: `${baseLink}/download/${collectionId}.gpkg`
        }
    ];
    return links;
}

export async function genMainLinks(obj) {
    const { baseLink } = await genBaseLink(obj);
    const links = [
        {
            rel: "self",
            title: "This document as JSON",
            type: "application/json",
            href: `${baseLink}/collections`
        },
        {
            rel: "alternate",
            title: "This document as HTML",
            type: "text/html",
            href: `${baseLink}/collections?f=html`
        }
    ];
    return links;
}
export async function genLinks4feature(collectionId: string, featureId: string, obj) {
    const { baseLink } = await genBaseLink(obj);
    const links: Array<any> = [
        {
            href: `${baseLink}/collections/${collectionId}/items/${featureId}?f=json`,
            rel: "self",
            type: "application/geo+json",
            title: "This document as GeoJSON"
        },
        {
            href: `${baseLink}/collections/${collectionId}/items/${featureId}?f=html`,
            rel: "alternate",
            type: "text/html",
            title: "This document as HTML"
        },
        {
            href: `${baseLink}/collections/${collectionId}/items/${featureId}?f=json`,
            rel: "alternate",
            type: "application/json",
            title: "This document as JSON"
        },
        {
            href: `${baseLink}/collections/${collectionId}`,
            rel: "collection",
            type: "application/json",
            title: `${collectionId} collection Document`
        },
        {
            href: `${baseLink}/collections/${collectionId}/items?f=json`,
            rel: "items",
            type: "application/json",
            title: `${collectionId} items`
        }
    ];
    return links;
}

export async function genLinks4Conformance(obj) {
    const { baseLink } = await genBaseLink(obj);
    const links: Array<any> = [
        {
            rel: "self",
            title: "This document as JSON",
            type: "application/json",
            href: `${baseLink}/conformance`
        },
        {
            rel: "alternate",
            title: "This document as HTML",
            type: "text/html",
            href: `${baseLink}/conformance?f=html`
        }
    ];
    return links;
}

export async function genLink4landingPage(obj) {
    const { baseLink } = await genBaseLink(obj);
    const links: Array<any> = [
        {
            rel: "http://www.opengis.net/def/rel/ogc/1.0/data",
            href: `${baseLink}/collections`
        },
        {
            rel: 'self',
            type: 'application/json',
            href: `${baseLink}/`,
            title: 'This Document'
        },
        {
            rel: 'conformance',
            href: `${baseLink}/conformance`,
            type: 'application/json'
        },
        {
            rel: 'service-desc',
            type: 'application/vnd.oai.openapi+json;version=3.0',
            href: `${baseLink}/api`
        },
        {
            rel: 'service-doc',
            type: 'text/html',
            href: `${baseLink}/api.html`
        },
        {
            rel: 'data',
            type: 'application/json',
            href: `${baseLink}/collections`,
            title: 'collectionsDocument'
        }
    ];
    return links
}