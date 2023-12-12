import { createServerLinks } from "../../core/serverlinking";

export async function genLinks4featurecollection(collectionId: string, prevPageOffset: number, nextPageOffset: number, limit: number) {
    const { baseURL } = await createServerLinks();
    const links: Array<any> = [
        {
            rel: "self",
            href: `${baseURL}/collections/${collectionId}/items?f=json`,
            type: "application/geo+json",
            title: "This document as GeoJSON"
        },
        {
            rel: "alternate",
            href: `${baseURL}/collections/${collectionId}/items?f=html`,
            type: "text/html",
            title: "This document as HTML"
        },
        {
            rel: "alternate",
            href: `${baseURL}/collections/${collectionId}/items?f=json`,
            type: "application/json",
            title: "This document as JSON"
        },
        {
            rel: "prev",
            href: `${baseURL}/collections/${collectionId}/items?f=json&offset=${prevPageOffset}&limit=${limit}`,
            type: "application/geo+json",
            title: "The previous page of results"
        },
        {
            rel: "next",
            href: `${baseURL}/collections/${collectionId}/items?f=json&offset=${nextPageOffset}&limit=${limit}`,
            type: "application/geo+json",
            title: "The next page of results"
        }
    ];
    return links;
}

export async function genLinks4collections(collectionId: string) {

    const { baseURL } = await createServerLinks();
    const links = [
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

export async function genMainLinks() {
    const { baseURL } = await createServerLinks();
    const links = [
        {
            rel: "self",
            title: "This document as JSON",
            type: "application/json",
            href: `${baseURL}/collections?f=json`
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
export async function genLinks4feature(collectionId: string, featureId: string) {
    const { baseURL } = await createServerLinks();
    const links: Array<any> = [
        {
            href: `${baseURL}/collections/${collectionId}/items/${featureId}?f=json`,
            rel: "self",
            type: "application/geo+json",
            title: "This document as GeoJSON"
        },
        {
            href: `${baseURL}/collections/${collectionId}/items/${featureId}?f=html`,
            rel: "alternate",
            type: "text/html",
            title: "This document as HTML"
        },
        {
            href: `${baseURL}/collections/${collectionId}/items/${featureId}?f=json`,
            rel: "alternate",
            type: "application/json",
            title: "This document as JSON"
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
            type: "application/json",
            title: `${collectionId} items`
        }
    ]
}