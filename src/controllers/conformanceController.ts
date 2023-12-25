import { defCommonQueryParams } from "./core/commonParams";
import { createLinks4Conformance } from "./core/createLinks";
import { validateQueryParams } from "./core/validParamsFun";
exports.getConformance = async function getConformance(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        const { f } = await defCommonQueryParams(context, null, null);
        if (f == 'json') {
            const conformanceDeclaration = {
                conformsTo: [
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
                    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
                    "http://www.opengis.net/spec/ogcapi-features-2/1.0/conf/crs"
                ],
                links: await createLinks4Conformance()
            };
            context.res.status(200).set('content-type', 'application/json').setBody(conformanceDeclaration);
        }
    }
}