import { supportedCRS } from "../common/coreVariables";

export default async function initBboxCrs(context: any) {
    const bboxCrs:string = context.params.query['bbox-crs'] === undefined ? supportedCRS[0] : context.params.query['bbox-crs'];
    return bboxCrs;
}