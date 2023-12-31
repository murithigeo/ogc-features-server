import  {validateQueryParams}  from "../config/common/validateParams";
import { supportedCRS } from "../config/common/coreVariables";
import { generateCollectionInfo } from "../config/makeObject/collection";
import { links4MainColl } from "../config/links";

exports.getAllCollections = async function getAllCollections(context) {
    //console.log(`queryParams: ${context.params.query}`)
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        const listAllCRS = false;
        const gtdbMetadata = await generateCollectionInfo('gtdb', listAllCRS, context);
        //const goiMetadata = await generateCollectionInfo('goi', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
        //const coupsMetadata = await generateCollectionInfo('coups', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
        //const conflictsMetadata = await generateCollectionInfo('conflicts', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);
        //const traveladvisoriesMetadata = await generateCollectionInfo('traveladvisories', storageCRS, listAllCRS, trs, storageCrsCoordinateEpoch, context);

        const collections = {
            title: "Available datasets",
            links: await links4MainColl(context),
            collections: [
                gtdbMetadata
                //incidentsMetadata,
                //conflictsMetadata,
                //coupsMetadata,
                //goiMetadata,
                //traveladvisoriesMetadata
            ],
            crs: supportedCRS,
        };
        context.res
            .status(200)
            .set('content-type', 'application/json')
            .setBody(collections);
    }
}
 //exports.getAllCollections();
exports.getOneCollection = async function getOneCollection(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        const collectionId = context.params.path.collectionId;
        const listAllCRS = true;
        switch (collectionId) {
            case 'gtdb':
                const gtdbMetadata = await generateCollectionInfo('gtdb', listAllCRS, context);

                //console.log(context.params.query);
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(gtdbMetadata);
                break;
        }
    }

}