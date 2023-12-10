const ogr2ogr = require('ogr2ogr').default;
//import * as ogr2ogr from 'ogr2ogr'.default;
import { downloadIncidents } from './incidentsController'
exports.downloadDataset = async function downloadDataset(context) {
    const collectionId = context.params.path.collectionId;
    switch (collectionId) {
        case 'incidents':
            const featurecollection = await downloadIncidents();
            let { data } = await ogr2ogr(featurecollection)
            const { stream } = await ogr2ogr(data, {
                options: ["-nln", "incidents"],
                format: 'GPKG'
            });
            context.res
                .status
                .set('content-type', 'application/geopackage+sqlite3')
                .setBody(stream);
            break;
            
    }
}