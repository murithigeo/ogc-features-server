import * as path from 'path';
import { validateQueryParams } from "../config/common/validateParams"
import * as fs from 'fs';

exports.getcss = async function getcss(context) {
    const unexpectedParams = await validateQueryParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400);
    } else {
        const cssFile = context.params.path.filename;
        const filepath = `../config/html/styles/${cssFile}`;
        const foundStyle = fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');
        console.log(foundStyle);
        context.res
            .status(200)
            .set('content-type', 'text/css')
            .setBody(foundStyle);
    }
}