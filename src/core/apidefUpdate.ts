import * as jsYAML from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { createServerLinks } from './serverlinking';
import { getCRSArray } from '../controllers/core/CRS';

export async function addServers() {
    const { baseURL } = await createServerLinks();
    const editDocument = fs.readFileSync(path.resolve(__dirname, '../openapi-editable.yaml'), 'utf-8');
    const parsedYAML = jsYAML.load(editDocument);
    
    parsedYAML.servers = [
        {
            url: baseURL,
            description: "If 1**.***.***.*** is not working, then it is localhost"
        },
        /*
        {
            url: baseURL2,
            description: "Server will always be available at this address"
        }
        */
    ];

    const CRSArray = await getCRSArray();
    parsedYAML.components.parameters.crs.schema.enum = CRSArray;

    //Supported bbox-crs found in collection/crs
    //parsedYAML.components.parameters['bbox-crs'].schema.enum = CRSArray;
    const finalYAML = jsYAML.dump(parsedYAML, { noRefs: true });
    fs.writeFileSync(path.resolve(__dirname, '../openapi.yaml'), finalYAML);
}