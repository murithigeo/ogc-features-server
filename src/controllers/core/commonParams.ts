import { verify_use_CRS } from "./CRS";
import * as proj4 from 'proj4';
const { QueryTypes } = require('sequelize');
import * as db from '../../models';
import { genbboxArray } from './collectionInfogen';
import { supportedCRS } from "./coreVars";

export async function defCommonQueryParams(obj: any, ORM: any, collectionId: string) {
    //To ease enumeration of active query parameters to be used in links, maybe init context.params.query.x yourself
    /**
     * @param f Specifying f overrides the default
     * @default f='json'
     * @returns json/html/?
     */
    //const f: string = obj.params.query.f === undefined ? 'json' : obj.params.query.f;

    //since exegesis will set json as default, validating f is not necessary
    const f: string = obj.params.query.f;

    /**
     * @param offset
     * @default offset=0 Is same as no offset
     * @override with specifying offset for paging
     */

    const offset: number = obj.params.query.offset === undefined || obj.params.query.offset < 0 ? 0 : obj.params.query.offset;

    /**
     * @param limit
     * @default 100. Must match OAS3 spec paramSchema
     * @returns limit
     */
    //    const limit: number = obj.params.query.limit === undefined ? 100 : obj.params.query.limit;
    const limit: number = obj.params.query.limit;
    /**
     * @description Defines the crs of the supplied bbox. Since the storageCrs is ${storageCrs[0]}, the default bbox-crs is assumed to be storageCrs[1]. Otherwise, overriden by client
     * @['bbox-crs'] 
     * @default storageCRS[1]
     */
    const bboxCrs = obj.params.query['bbox-crs'] === undefined ? supportedCRS[0] : obj.params.query['bbox-crs'];

    /**
     * @crs determines outputCrs of features requested.
     * @default is "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
     */
    const crs = obj.params.query.crs === undefined ? supportedCRS[0] : obj.params.query.crs;

    /**
     * @default is <${storageCRS[0]}>
     * @contentCrs is the header value of returned dataset
     */
    const contentCrs = obj.params.query.crs === undefined ? `<${supportedCRS[0]}>` : `<${obj.params.query.crs}>`

    //const datetime =
    let exceedsExtent: boolean;
    async function validatebbox(minx: any, miny: number, maxx: number, maxy: number) {
        let extent: Array<any>;
        switch (collectionId) {
            case 'incidents':
                extent = await genbboxArray((await db.sequelize.query(`select st_setsrid(st_extent(geom),4326) as bbox from ${collectionId}`, { type: QueryTypes.SELECT })))
                break;
            case 'conflicts' || 'coups' || 'goi':
                extent = await genbboxArray((await db.sequelize.query(`select st_setsrid(st_extent(level0.geom),4326) as bbox from ${collectionId} inner join on ${collectionId}.admin0 = level0.admin0`, { type: QueryTypes.SELECT })))
                break;
            case 'traveladvisories':
                const geomColumn = obj.params.query.geomColumn === undefined ? 'xcountryGeom' : obj.params.query.geomColumn;
                extent = await genbboxArray((await db.sequelize.query(`select st_setsrid(st_extent(${geomColumn}),4326) as bbox from ${collectionId}`, { type: QueryTypes.SELECT })))
                break;
        };
        const bboxPairs = [[minx, miny], [maxx, miny], [maxx, maxy], [minx, maxy]];
        const extentPairs = [
            [extent[0], extent[1]], //minx, miny
            [extent[2], extent[1]], //maxx,miny
            [extent[2], extent[3]], //maxx,maxy
            [extent[0], extent[3]] //minx,maxy
        ]; //minx,maxy
        const bboxCrsData = await verify_use_CRS(bboxCrs);

        proj4.defs(bboxCrsData[0]['auth_name'] + ':' + bboxCrsData[0]['srid'], bboxCrsData[0]['proj4text']);

        const storageCRSData = await verify_use_CRS("http://www.opengis.net/def/crs/EPSG/0/4326");
        proj4.defs(storageCRSData[0]['auth_name'] + ':' + storageCRSData[0]['srid'], storageCRSData[0]['proj4text']);
        console.log(storageCRSData[0]['auth_name'] + ':' + storageCRSData[0]['srid']);
        console.log(bboxCrsData[0]['auth_name'] + ':' + bboxCrsData[0]['srid']);

        const transformedBbox = bboxPairs.map(coord =>
            proj4(bboxCrsData[0]['auth_name'] + ':' + bboxCrsData[0]['srid'], storageCRSData[0]['auth_name'] + ':' + storageCRSData[0]['srid'], coord));

        exceedsExtent = (transformedBbox.flat()).some(value =>
            value < Math.min(...extentPairs.flat()) ||
            value > Math.max(...extentPairs.flat())
        );
        const message = { message: 'bbox exceeds extent' };
        //console.log('transformedBbox', transformedBbox[0]);
        //console.log('bboxArray2check', bboxArray2Check);
        //console.log('bboxArray2Check', bboxArray2Check);
        return exceedsExtent;
    }

    //obj.params.query.bbox === undefined ? undefined : exceedsExtent = await validatebbox(obj.params.query.bbox[0], obj.params.query.bbox[1], obj.params.query.bbox[2], obj.params.query.bbox[3]);
    /*
    obj.params.query.bbox !== undefined &&
        (await validatebbox(obj.params.query.bbox[0], obj.params.query.bbox[1], obj.params.query.bbox[2], obj.params.query.bbox[3])) == true ?
        obj.res.status(400).setBody({ message: 'bbox exceeds extent' }) : undefined;
*/

    /**
     * @radius return features a certain radiusDistance away from [x,y].
     */
    const radius = obj.params.query.radius ? {
        radius: ORM.literal(`ST_DistanceSPhere(geom,(ST_Transform(ST_SetSRID(ST_MakePoint(:lon,:lat),:bboxSRID),4326))) <= radiusDistance`)
    } : undefined;

    /**
     * @link https://github.com/opengeospatial/ets-ogcapi-features10/issues/233#issuecomment-1867426037
     * @order South(y), west(x), north(y), east(x)
     * @enum miny, minx,maxy,maxx
     * @bbox Returns features within a four cornered bbox
     * @description values & bbox-crs must be transformable to and from storageCRS[1]
     * @default crs is storageCRS[0]
     * @EPSG3395 && @EPSG3857 use x,y
     */

    /**
     * @description Due to the axis order of geographic vs projected CRS and OGC requirements, several disambiguations are required.
     * @geographic CRS @extent [miny,minx,maxy,maxx] & coordinates @follow [y,x]
     * @projected CRS @extent [minx,miny,maxx,maxy] & coordinates @follow [x,y]
     * interestingly, WGS84=EPSG:4326=CRS84. Proposal to have an official designation for OGC:CRS84 inside the spatial_ref_sys table to act same as 4326 but for checking of isGeographic
     * This is because CRS84 complicates which valid order of CRS with projected/geo. coords and is same as 4326 except that PostGIS stores 4326 with x,y
     * @however CRS84 uses [x,y] order while EPSG:4326 uses [y,x] order. PostGIS uses [x,y] order necessitating Flipping coordinates if crs=4326.
     */

    /**
     * There is also a need to reduce number of checks for validity of CRS and bbox-crs parameters
     * Check for crs and bbox-crs validity here. Assign SRIDs manually since exegesis will enforce bbox & crs enum
     * This frees up checking for srid from database meaning even CRS84 can return a distinct signature
     */


    const crsCheck: Array<any> = await verify_use_CRS(crs);
    const bboxCrsCheck: Array<any> = await verify_use_CRS(bboxCrs);
    //let isGeographic: boolean;
    let flipCoords: boolean;
    let bboxParams: Array<any>;

    crsCheck.length < 1 ?
        undefined :
        crsCheck[0].isGeographic === true ?
            flipCoords = true :
            flipCoords = false;
    bboxCrsCheck.length < 1 ?
        undefined :
        bboxCrsCheck[0].isGeographic === true ?
            bboxParams = [
                obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[1], //minx
                obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[0], //miny
                obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[3], //maxx
                obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[2] //maxy
            ] : bboxParams = [
                obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[0], //minx
                obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[1], //miny
                obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[2], //maxx
                obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[3]]; //maxy

    const bbox = bboxCrsCheck.length < 1 ? undefined : obj.params.query.bbox ? {
        //bbox: ORM.literal(`ST_Contains(ST_Transform(ST_MakeEnvelope(${bboxParams.join(',')},${bboxCrsCheck[0].srid}),4326),"gtdb"."geom") is true`)
        bbox: ORM.literal(`ST_Intersects("gtdb"."geom",ST_Transform(ST_MakeEnvelope(${bboxParams.join(',')},${bboxCrsCheck[0].srid}),4326))`)
    } : undefined;


    return {
        f,
        offset,
        limit,
        bboxCrs,
        crs,
        //spatialQueryParamsReplacements,
        bbox,
        radius,
        exceedsExtent,
        contentCrs,
        bboxCrsCheck,
        crsCheck,
        flipCoords,
        bboxParams
        //  linksFC
    };
}

export async function pagingDef(count: number, offset: number, limit: number) {
    const nextPageOffset: number = offset + limit;
    const prevPageOffset: number = offset - limit;
    const numberMatched: number = count - offset;
    return { nextPageOffset, prevPageOffset, numberMatched }
}