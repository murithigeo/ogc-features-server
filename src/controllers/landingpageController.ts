import { genLink4landingPage } from "./core/linksGen";
import { validateQueryParams } from "./core/validParamsFun";

exports.getLandingPage = async function getLandingPage(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400).set('content-type', 'application/json')
    } else {
        const landingPage = {
            title: "Demo API Backend",
            description: "LAnding Page Document",
            links: await genLink4landingPage(context)
        };
        context.res
            .status(200)
            .set('content-type', 'application/json')
            .setBody(landingPage);

    }
    /*
            */
}
