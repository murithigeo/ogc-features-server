import {createServerLinks} from "../../../etc";

export default async function init4collections(collectionId: string, context: any) {
    let fKeys = {
        self_F: undefined,
        alt_F: undefined,
        self_type: undefined,
        alt_type: undefined
    };

    const baseURL  = await createServerLinks();

    context.params.query.f === undefined || context.params.query.f === 'json' ? fKeys = {
        self_F: 'json',
        alt_F: 'html',
        self_type: 'application/json',
        alt_type: 'text/html'
    } : fKeys = {
        self_F: 'html',
        alt_F: 'json',
        self_type: 'text/html',
        alt_type: 'application/json'
    }
    const links: Array<object> = [
        {
            rel: "self",
            title: `${collectionId} collection`,
            type: `${fKeys.self_type}`,
            href: `${baseURL}/collections/${collectionId}?f=${fKeys.self_F}`
        },
        {
            rel: "items",
            title: `${collectionId} items`,
            type: "application/geo+json",
            href: `${baseURL}/collections/${collectionId}/items?f=json`
        },
        {
            rel: "alternate",
            title: `${collectionId} items as html`,
            type: `${fKeys.alt_type}`,
            href: `${baseURL}/collections/${collectionId}/items?f=${fKeys.alt_F}`
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