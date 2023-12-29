import createServerLinks from "../../../core/serverlinking";

let fKeys = {
    self_F: undefined,
    alt_F: undefined,
    self_type: undefined,
    alt_type: undefined
};

export default async function init4maincollection(context: any) {
    const { baseURL } = await createServerLinks();
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
            rel: "self",
            title: `This document as ${fKeys.self_F}`,
            type: `${fKeys.self_type}`,
            href: `${baseURL}/collections?f=${fKeys.self_F}`
        },
        {
            rel: "alternate",
            title: `This document as ${fKeys.alt_F}`,
            type: `${fKeys.alt_type}`,
            href: `${baseURL}/collections?f=${fKeys.alt_F}`
        }
    ];
    return links;
}