import { validateQueryParams } from "../config/common/validateParams";
import getCoreParams from "../config/params";
import { exportEvents } from "./gtdbController";

exports.downloadDataset = async function downloadDataset(context) {
    if ((await validateQueryParams(context)).length > 0) {
        context.res.status(400).JSON({ message: "Invalid query parameters" });
    } else {

        const collectionId = context.params.path.collectionId;
        switch (collectionId) {
            case 'gtdb':
                const crs = await getCoreParams(context);
                const featurecollection = await exportEvents(crs);
                //fs.writeFileSync('./gtdb.json',JSON.stringify(featurecollection),'utf8');

                /*
                                for (let i=0;i<featurecollection.layers.count();i++){
                                    const layer
                                }
                                */
                /**
                 * ogr2ogr is not suitable due to the size of the data
                 */
                /*
                let { data } = await ogr2ogr(featurecollection)
                const  stream  = await ogr2ogr(data, {
                    options: ["-nln", "incidents"],
                    format: 'GPKG'
                });
                */

                /*context.res
                    .status
                    .set('content-type', 'application/geopackage+sqlite3')
                    .setBody(geoPackageFile);
                    */
                break;

        }
    }

}