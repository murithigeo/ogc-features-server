/**
 * Updates the specification document by modifying the YAML file.
 * This function reads the editable YAML file, makes necessary changes to the parsed YAML object,
 * and writes the modified YAML back to the file system.
 * @returns {Promise<void>} A promise that resolves when the specification document is successfully updated.
 */
import * as jsYAML from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { createServerLinks } from './serverlinking';
import { getCRSArray } from '../controllers/core/CRS';
 
export async function updateSpecDoc() {
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

    const CRSArray = await getCRSArray(); //Gets an array of CRS supported by server 
    parsedYAML.components.parameters.crs.schema.enum = CRSArray;
    
    parsedYAML.components.parameters['bbox-crs'].schema.enum = CRSArray; //Due to how queryParams are validated, the CRS[] in the collections response is enumed in crs and bbox-crs params

    //These changes to the OAS3 doc are written into the loaded file. This is file used by exegesis
    const finalYAML = jsYAML.dump(parsedYAML, { noRefs: true });

    fs.writeFileSync(path.resolve(__dirname, '../openapi.yaml'), finalYAML);
}