import { verify_use_CRS } from "./CRS";
import * as proj4 from 'proj4';
const { QueryTypes } = require('sequelize');
import * as db from '../../models';
import { genbboxArray } from './collectionInfogen';
import { storageCRS } from "./coreVars";

export async function defCommonQueryParams(obj: any, ORM: any, collectionId: string) {
    const f: string = obj.params.query.f === undefined ? 'json' : obj.params.query.f;
    console.log('f', f);
    const offset: number = obj.params.query.offset === undefined || obj.params.query.offset < 0 ? 0 : obj.params.query.offset;
    const limit: number = obj.params.query.limit === undefined ? undefined : obj.params.query.limit;
    const admin0 = obj.params.query.admin0 ? { admin0: obj.params.query.admin0 } : undefined;

    //const radius = obj.params.query.radius === undefined ? {radius:sequelize.literal(`st_distancesphere(${collectionid}.)`)
    const bboxCrs = obj.params.query['bbox-crs'] === undefined || obj.params.query['bbox-crs'] === `${storageCRS[0]}` ? "http://www.opengis.net/def/crs/EPSG/0/4326" : obj.params.query['bbox-crs'];
    const crs = obj.params.query.crs === undefined || obj.params.query.crs === `${storageCRS[0]}` ? "http://www.opengis.net/def/crs/EPSG/0/4326" : obj.params.query.crs;
    const contentCrs = obj.params.query.crs === undefined ? `<${storageCRS[0]}>` : `<${obj.params.query.crs}>`
    const spatialQueryParamsReplacements: any = {
        minx: (obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[0]),
        miny: (obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[1]),
        maxx: (obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[2]),
        maxy: (obj.params.query.bbox === undefined ? undefined : obj.params.query.bbox[3]),
        lon: (obj.params.query.radius === undefined ? undefined : obj.params.query.radius[0]),
        lat: (obj.params.query.radius === undefined ? undefined : obj.params.query.radius[1]),
        bboxSRID: parseInt(bboxCrs.split('/').pop()),
        radiusDistance: (obj.params.query.radius === undefined ? undefined : obj.params.query.radius[2])
    };
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

    //let bbox: any;
    //let radius: any;

    const radius = obj.params.query.radius ? {
        radius: ORM.literal(`ST_DistanceSPhere(geom,(ST_Transform(ST_SetSRID(ST_MakePoint(:lon,:lat),:bboxSRID),4326))) <= radiusDistance`)
    } : undefined;

    const bbox = obj.params.query.bbox ? {
        bbox: ORM.literal(`ST_Contains(ST_Transform(ST_MakeEnvelope(:minx, :miny, :maxx, :maxy, :bboxSRID),4326),"gtdb"."geom") is true`)
    } : undefined;


    // Paging (limitting and offsetting)
    const nextPageOffset = offset + limit;
    const prevPageOffset = offset > 0 || offset === 0 ? Math.max(offset - limit, 0) : Math.max(offset - limit, 0);
    /*
    if (collectionId === 'incidents') {
        

        

    } else if (collectionId === 'goi' || collectionId === 'conflicts' || collectionId === 'coups') {
        bbox = obj.params.query.bbox ? { bbox: ORM.literal(`ST_Contains(ST_Transform(ST_MakeEnvelope(:minx, :miny, :maxx, :maxy, :bboxSRID),4326),geom) is true`) } : undefined;

        radius = obj.params.query.radius ? { radius: ORM.literal(`ST_DistanceSphere(geom,(ST_SetSRID(ST_MakePoint(:lon,:lat),:bboxSRID),4326)) <= radiusDistance`) } : undefined;

    } else if (collectionId === 'traveladvisories') {
        const geomColumn = obj.params.query.geomColumn === undefined ? 'xcountryGeom' : obj.params.query.geomColumn;

        bbox = obj.params.query.bbox ? {
            bbox: ORM.literal(`ST_Contains(ST_Transform(ST_MakeEnvelope(:minx,:miny,:maxx,:maxy,:bboxSRID),4326)),${geomColumn}) is true`)
        } : undefined;
    }
    */

    return { f, offset, limit, admin0, bboxCrs, crs, spatialQueryParamsReplacements, bbox, radius, exceedsExtent, contentCrs, prevPageOffset, nextPageOffset };
}
