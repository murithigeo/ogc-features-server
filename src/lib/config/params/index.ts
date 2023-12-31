import initBbox from "./bbox";
import initBboxCrs from "./bboxCrs";
import initContentCrs from "./contentCrs";
import initCrs from "./crs";
import initDateTime from "./datetime";
import {initF$JSON,initF$GeoJSON} from "./f";
import validateCRSIndex from "./initCheckCRS";
import initLimit from "./limit";
import initOffset from "./offset";
import initPaging from "./paging";

export default async function getCoreParams(context: any) {
    const datetimeVals = context.params.query.datetime !== undefined ? await initDateTime(context) : undefined;
    const bbox = await initBbox(context);
    const bboxCrs = await initBboxCrs(context);
    const contentCrs = await initContentCrs(context);
    const crs = await initCrs(context);
    const { crsCheck, bboxCrsCheck, flipCoords } = await validateCRSIndex(context);
    const limit = await initLimit(context);
    const offset = await initOffset(context);
    const GeoJSON$f$CT= await initF$GeoJSON(context);
    const JSON$f$CT= await initF$JSON(context);
//console.log (offset)
    return { datetimeVals, bbox, bboxCrs, contentCrs, crs, crsCheck, bboxCrsCheck, flipCoords, limit, offset, GeoJSON$f$CT, JSON$f$CT };
}

export async function featurecollNumValues(count: number, offset: number, limit: number) {
    const { numberReturned, nextPageOffset, prevPageOffset } = await initPaging(count, offset, limit);
    return { numberReturned, nextPageOffset, prevPageOffset };
}
