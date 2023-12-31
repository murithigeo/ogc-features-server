import validateCRSIndex from "./initCheckCRS";

export default async function initBbox(context: any) {
    let bbox: Array<any>
    const { bboxCrsCheck } = await validateCRSIndex(context);
    
    bboxCrsCheck.length < 1 ?
        undefined :
        bboxCrsCheck[0].isGeographic === true ?
            bbox = [
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[1], //minx
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[0], //miny
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[3], //maxx
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[2] //maxy
            ] :
            bbox = [
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[0], //minx
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[1], //miny
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[2], //maxx
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[3] //maxy
            ]
    return bbox
}