import * as YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

exports.getServiceDesc = async function getServiceDesc(context) {
    const openapi = YAML.parse(fs.readFileSync(path.resolve(__dirname, '../openapi.yaml'), 'utf-8'));
    context.res
        .status(200)
        .set('content-type', 'application/json')
        .set('content-type', 'application/vnd.oai.openapi+json;version=3.0')
        .setBody(openapi);
}