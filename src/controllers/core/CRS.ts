import * as models from '../../models';
const Spatial_ref_sys = models.spatial_ref_sys;
const { Op } = require("sequelize");
import { storageCRS } from '../core/coreVars';

/**
 * 
 * @param crs Parses the CRS string from the {crs}/{bbox-crs} to get {authority_name}+{srid} code which must match
 * @returns rows which can only have 2>length>0. If empty, then not valid CRS
 */
export async function verify_use_CRS(crs: string) {
    const url = new URL(crs);
    const auth_name = url.pathname.split('/')[3];
    const version = parseInt(url.pathname.split('/')[4]); //TBI since PostGIS does not versions of an SRID
    const srid = parseInt(url.pathname.split('/')[5]);

    //console.log(crs);

    const rows = await Spatial_ref_sys.findAll({
        attributes: ['srid', 'auth_name', 'proj4text'],
        order: [['srid', 'ASC']],
        where: {
            [Op.and]: [
                { auth_name: auth_name },
                { srid: srid }
            ]
        },
        raw: true
    });
    return rows;
}

/**
 * 
 * @returns An array of CRS that can be transformed to and from CRS84/EPSG:4326.
 * As of now, only two additional CRS supported
 */
export async function getCRSArray() {
    /*
    const rows = await Spatial_ref_sys.findAll({
        where: {
            srid: {
                [Op.not]: 4326 //This is to prevent duplicate CRS84 as returned by the query
            }
        },
        attributes: ['srid', 'auth_name'],
        order: [['srid', 'ASC']],
        raw: true
    });
    const CRSArray = rows.map(item => {
        const { srid, auth_name } = item;
        const version: number = 0;
        return `http://www.opengis.net/def/crs/${auth_name}/${version}/${srid}`;
    });
    */
    const fullArray = [
        storageCRS[0], 
        storageCRS[1],
        //"http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/3395",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        //"http://www.opengis.net/def/crs/EPSG/0/4326"
    ];
    //console.log(fullArray);
    return fullArray;
}