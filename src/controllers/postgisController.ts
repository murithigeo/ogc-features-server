import { QueryTypes } from "sequelize";
import * as db from "../models";
import { validateParams } from "./core/validParamsFun";

exports.getpostgisVersion = async function getpostgisVersion(context) {
    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        //PostGIS version
        const PostGISVersion = db.sequelize.query("SELECT PostGIS_Version();", { type: QueryTypes.SELECT })["postgis_version"];
        
        context.res.status(200).set('content-type', 'application/json').setBody(PostGISVersion);
    }

}