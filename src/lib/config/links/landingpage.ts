import { createServerLinks } from "../../../etc";

export default async function init4landingpage(context: any) {
    const baseURL = await createServerLinks();
    let fKeys = {
        self_F: undefined,
        alt_F: undefined,
        self_type: undefined,
        alt_type: undefined
    };
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
    };

    const links: Array<object> = [
        {
            rel: 'self',
            type: `${fKeys.self_type}`,
            href: `${baseURL}/?f=${fKeys.self_F}`,
            title: `This Document as ${fKeys.self_F}`
        },
        {
            rel: `alternate`,
            href: `${baseURL}/?f=${fKeys.alt_F}`,
            type: `${fKeys.alt_type}`,
            title: `This Document as ${fKeys.alt_F}`
        },
        {
            rel: 'conformance',
            href: `${baseURL}/conformance?f=json`,
            type: 'application/json',
            title: `Conformance Document as json`
        },
        {
            rel: 'service-desc',
            type: 'application/vnd.oai.openapi+json;version=3.0',
            href: `${baseURL}/api`,
            title: 'Capability Statement as OpenAPI 3.0.0 Document'
        },
        {
            rel: 'service-doc',
            type: 'text/html',
            href: `${baseURL}/api.html`,
            title: `View Capability Statement as HTML Document`
        },
        {
            rel: 'data',
            type: 'application/json',
            href: `${baseURL}/collections?f=json`,
            title: 'collectionsDocument in json'
        }
    ];
    return links
}