import { verify_use_CRS } from "./CRS";
import * as proj4 from 'proj4';

export async function validatebbox(bboxArray: any, bboxCrs: string, storageCRS: string, extent: Array<any>) {
    try {
        const storageCRSData = await verify_use_CRS(storageCRS[0]);
        const storageCRS_proj4Text = storageCRSData[0]['proj4text'];
        const storageCRSAuth_SRID = storageCRSData[0]['auth_name'] + ':' + storageCRSData[0]['srid'];

        proj4.defs(storageCRSAuth_SRID, storageCRS_proj4Text);

        const bboxCrsData = await verify_use_CRS(bboxCrs);
        const bboxCrs_proj4Text = bboxCrsData[0]['proj4text'];
        const bboxCrsAuth_SRID = bboxCrsData[0]['auth_name'] + ':' + bboxCrsData[0]['srid'];

        proj4.defs(bboxCrsAuth_SRID, bboxCrs_proj4Text);

        const transformedBbox = bboxArray.map(coord => proj4(bboxCrsAuth_SRID, storageCRSAuth_SRID, coord));

        const exceedsExtent = transformedBbox.some((coord, index) =>
            coord < extent[index * 2] || coord > extent[index * 2 + 1]
        );
        return { exceedsExtent }
    } catch (error) {
        return error;
    }
}