import * as jsYAML from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { createServerLinks } from './serverlinking';
import * as models from '../models';
import { getCRSArray } from '../controllers/core/validateCRS';

export async function addServers() {
    const { baseURL } = await createServerLinks();
    const editDocument = fs.readFileSync(path.resolve(__dirname, '../openapi-editable.yaml'), 'utf-8');
    const parsedYAML = jsYAML.load(editDocument);
    parsedYAML.servers = [
        {
            url: baseURL,
            description: "serveraddress ;serverIP || localhost"
        }
    ];

    const CRSArray = await getCRSArray();
    parsedYAML.components.parameters.crs.schema.enum = CRSArray;
    parsedYAML.components.parameters['bbox-crs'].schema.enum = CRSArray;
    const finalYAML = jsYAML.dump(parsedYAML, { noRefs: true });
    fs.writeFileSync(path.resolve(__dirname, '../openapi.yaml'), finalYAML);
}