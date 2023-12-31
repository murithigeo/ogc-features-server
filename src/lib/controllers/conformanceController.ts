import { validateQueryParams } from "../config/common/validateParams";
import { links4conformance } from "../config/links";

exports.getConformance = async function getConformance(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        if (context.params.query.f==='json'||context.params.query.f===undefined) {
            const conformanceDeclaration = {
                conformsTo: [
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
                    "http://www.opengis.net/spec/ogcapi-features-2/1.0/conf/crs"
                ],
                links: await links4conformance(context)
            };
            context.res.status(200).set('content-type', 'application/json').setBody(conformanceDeclaration);
        }
    }
}