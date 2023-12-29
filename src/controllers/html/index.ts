/*
export async function createLinkTags(links: Array<any>) {
    const linkTags = links.map((link) => {
        return `<a href="${link["href"]} rel="${link["rel"]}" type="${link["type"]}>${link["title"]}</a>}`;
    });
    return linkTags.join("\n");
}
let landingPage = {
    title: "Demo API Backend",
    description: "LAnding Page Document",
    links: [
        {
            href: "https://www.google.com",
            rel: "self",
            type: "text/html",
            title: "Google"
        },
        {
            href: "https://www.yahoo.com",
            rel: "self",
            type: "text/html",
            title: "Yahoo"
        }
    ]
};

export async function createLandingPage(landingPage: object) {
    const linksArray = landingPage.links;
    const linksText = await createLinkTags(landingPageDoc.links);
    const landingPageCde = `<html>
                        <head>
                        <title>${landingPageDoc["title"]}</title>
                        <styling>
                        body {background-color: #f2f2f2; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333; margin: 0; padding: 0;}
                        </styling>
                        </head>
                        <body>
                        <h1>${linksText}</h1>
                        </body>
                        </html>`
    return landingPageCde;
}

export async function fullPage(){
    //const
}
*/