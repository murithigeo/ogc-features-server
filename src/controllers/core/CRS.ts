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

    /*
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
        */
       console.log(crs);

       /**
        * @description is an array containing the CRS that will be used in the project
        * @crs is the CRS that is requested by the client. Default is <${storageCRS[0]}>
        * @srid is the SRID of the CRS. The default @crs will default to 4326 with the notable exception that its axis order is x,y
        * @postgis stores geographic coordinates in the order x,y although 4326 is y,x. This necessitates flipping of coordinates if crs=4326
        */
    const knownCRS = [
        {
            crs: 'http://www.opengis.net/def/crs/EPSG/0/3395',
            srid: 3395,
            auth_name: 'EPSG',
            isGeographic: false,
        },
        {
            crs: 'http://www.opengis.net/def/crs/EPSG/0/3857',
            srid: 3857,
            auth_name: 'EPSG',
            isGeographic: false,
        },
        {
            crs: 'http://www.opengis.net/def/crs/EPSG/0/4326',
            srid: 4326,
            auth_name: 'EPSG',
            isGeographic: true,
        },
        {
            crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84',
            srid: 4326,
            auth_name: 'OGC',
            isGeographic: false,
        }
    ];
    //const useCrs = knownCRS.find(item => item.crs === crs);
    const crsArray= knownCRS.filter(obj=>obj.crs===crs);
    //console.log(crsArray);
    return crsArray
}

/**
 * 
 * @returns An array of CRS that can be transformed to and from CRS84/EPSG:4326.
 * As of now, only two additional CRS supported
 */
export async function getCRSArray() {
    const fullArray = [
        storageCRS[0],
        storageCRS[1],
        "http://www.opengis.net/def/crs/EPSG/0/3395",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
    ];
    //console.log(fullArray);
    return fullArray;
}