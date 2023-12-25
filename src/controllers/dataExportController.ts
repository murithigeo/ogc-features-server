import { defCommonQueryParams } from "./core/commonParams";
import { validateQueryParams } from "./core/validParamsFun";
//import * as ogr2ogr from 'ogr2ogr'.default;
import { exportEvents } from "./gtdbController";
//import * as gdal from 'gdal-async';
//const { GeoJSONToGeoPackage } = require('@ngageoint/geopackage-geojson-js');
import * as fs from 'fs';

exports.downloadDataset = async function downloadDataset(context) {
    if ((await validateQueryParams(context)).length > 0) {
        context.res.status(400).JSON({ message: "Invalid query parameters" });
    } else {
        const { crs } = await defCommonQueryParams(context, null, 'gtdb');
        const collectionId = context.params.path.collectionId;
        switch (collectionId) {
            case 'gtdb':
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