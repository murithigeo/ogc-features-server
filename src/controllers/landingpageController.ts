import { validateQueryParams } from "./core/validParamsFun";
import {createLinks4LandingPage} from "./core/createLinks";

exports.getLandingPage = async function getLandingPage(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400).set('content-type', 'application/json')
    } else {
        const landingPage = {
            title: "Demo API Backend",
            description: "LAnding Page Document",
            links: await createLinks4LandingPage()
        };
        context.res
            .status(200)
            .set('content-type', 'application/json')
            .setBody(landingPage);

    }
}
