import { createServerLinks } from "../core/serverlinking";
import { validateParams } from "./validParamsFun";

exports.getLandingPage = async function getLandingPage(context) {
    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400).set('content-type', 'application/json')
    } else {
        const { baseURL } = await createServerLinks();

        const landingPage = {
            title: "Demo API Backend",
            description: "LAnding Page Document",
            links: [
                {
                    href: baseURL + '/',
                    rel: "self",
                    type: "application/json",
                    title: "This Document"
                },
                {
                    href: baseURL + '/api',
                    rel: "service-desc",
                    type: "application/vnd.oai.openapi+json;version=3.0",
                    title: "API Definition File"
                },
                {
                    href: baseURL + '/api.html',
                    rel: "service-doc",
                    type: "text/html",
                    title: "API Documentation Website, preferably SwaggerUI or Redoc"
                }, {
                    href: baseURL + '/conformance',
                    rel: "conformance",
                    type: "application/json",
                    title: "List of conformances implemented by this server"
                }, {
                    href: baseURL + '/collections',
                    rel: "data",
                    type: "application/json",
                    title: "Available collections"
                }
            ]
        };
        context.res
            .status(200)
            .set('content-type', 'application/json')
            .setBody(landingPage);

    }
    /*
            */
}
