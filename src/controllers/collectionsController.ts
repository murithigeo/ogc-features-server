import { QueryTypes } from "sequelize";
import * as db from "../models";

//import the baseURL
import { createServerLinks } from "../core/serverlinking";
import { validateQueryParams } from "./core/validParamsFun";
import { genLinks4collections, genMainLinks } from "./core/linksGen";

import { storageCRS, trs, storageCrsCoordinateEpoch } from "./core/coreVars";

import { getCRSArray } from "./core/CRS";
import { generateCollectionInfo } from "./core/collectionInfogen";

exports.getAllCollections = async function getAllCollections(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        const listAllCRS = false;
        const incidentsMetadata = await generateCollectionInfo('incidents', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
        //const goiMetadata = await generateCollectionInfo('goi', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
        //const coupsMetadata = await generateCollectionInfo('coups', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
        //const conflictsMetadata = await generateCollectionInfo('conflicts', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
        //const traveladvisoriesMetadata = await generateCollectionInfo('traveladvisories', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);

        const collections = {
            title: "Available datasets",
            links: await genMainLinks(context),
            collections: [
                incidentsMetadata,
                //conflictsMetadata,
                //coupsMetadata,
                //goiMetadata,
                //traveladvisoriesMetadata
            ],
            crs: await getCRSArray(),
        };
        context.res
            .status(200)
            .set('content-type', 'application/json')
            .setBody(collections);
    }
}
exports.getOneCollection = async function getOneCollection(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        const collectionId = context.params.path.collectionId;
        const listAllCRS = true;
        switch (collectionId) {
            case 'incidents':
                const incidentsMetadata = await generateCollectionInfo('incidents', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);

                //console.log(context.params.query);
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(incidentsMetadata);
                break;
            case 'goi':
                const goiMetadata = await generateCollectionInfo('goi', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(goiMetadata);
                break;
            case 'conflicts':
                const conflictsMetadata = await generateCollectionInfo('conflicts', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(conflictsMetadata);
                break;
            case 'traveladvisories':
                const traveladvisoriesMetadata = await generateCollectionInfo('traveladvisories', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context); context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(traveladvisoriesMetadata);
                break;
            case 'coups':
                const coupsMetadata = await generateCollectionInfo('coups', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(coupsMetadata);
                break;
        }
    }

}