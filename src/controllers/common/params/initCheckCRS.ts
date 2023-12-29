import verify_CRS from "../core/checkCRSs";
import initBboxCrs from "./bboxCrs";
import initCrs from "./crs";

export default async function validateCRSIndex(context: any) {
    const bboxCrsCheck: Array<any> = await verify_CRS(await initBboxCrs(context));
    const crsCheck: Array<any> = await verify_CRS(await initCrs(context));
    const flipCoords: boolean = crsCheck.length > 1 ? crsCheck[0].isGeographic === true ? true : false : undefined;
    return { bboxCrsCheck, crsCheck, flipCoords };
}