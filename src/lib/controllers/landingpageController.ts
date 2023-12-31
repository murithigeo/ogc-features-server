import { validateQueryParams } from "../config/common/validateParams";
import { links4landingPage } from "../config/links";

//import { createLandingPage } from "./html/index";

exports.getLandingPage = async function getLandingPage(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400).set('content-type', 'application/json')
    } else {
        const landingPage = {
            title: "Demo API Backend",
            description: "LAnding Page Document",
            links: await links4landingPage(context)
        };
        if (context.params.query.f === ('json' || undefined)) {
            context.res
                .status(200)
                .set('content-type', 'application/json')
                .setBody(landingPage);
        } else if (context.params.query.f == 'html') {
            console.log(landingPage);
            context.res
                .status(200)
                .set('content-type', 'text/html')
                .setBody({ message: `Supposed to be a html page` });

        }
    }
}
