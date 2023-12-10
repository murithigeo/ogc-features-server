import { createServerLinks } from "../core/serverlinking";
import { validateParams } from "./validParamsFun";
exports.getConformance = async function getConformance(context) {
    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        const { baseURL } = await createServerLinks();
        let f: string;
        !context.params.query.f ? f = 'json' : f = context.params.query.f;
        if (f == 'json') {
            const conformanceDeclaration = {
                conformsTo: [
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson"
                ],
                links: [
                    {
                        href: baseURL + '/conformance?f=json',
                        rel: 'self',
                        type: 'application/json'
                    }
                ]
            };
            context.res.status(200).set('content-type', 'application/json').setBody(conformanceDeclaration);
        }
    }
}