import * as sequelize from 'sequelize';
import * as models from '../models';
const { level0 } = require('../models');
const Coups = models.coups;
import { validateParams } from './core/validParamsFun';
import calcPaging from './core/paging';
const { Op } = require('sequelize');
import { verifyCRS } from './core/validateCRS';
import { genLinks4featurecollection } from './core/linksGen';
import { createFCobject } from './core/makeFCobject';

async function customColumnDetails(crs: string) {
    const columnDetails = [
        'dateoccurence',
        'coupid',
        'resolved',
        'resolutiondate',
        [
            sequelize.col('"level0"."country"'), 'country'
        ],
        [
            sequelize.fn('ST_Simplify', sequelize.fn('ST_Transform', sequelize.col('"level0"."geom"'), parseInt(crs.split('/').pop())), 0.001), 'geom'
        ]
    ];
    return columnDetails;
}
const attributes_l0 = {
    model: level0,
    attributes: {
        exclude: ['admin0'],
        include: ['geom']
    }
};
exports.getAllCoups = async function getAllCoups(context) {
    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        let f: string, limit: number, offset: number, collectionId: string = 'coups';
        context.params.query.f === undefined ? f = 'json' : f = context.params.query.f;
        context.params.query.limit === undefined ? limit = 10 : limit = context.params.query.limit; // set limit to 10 by default}
        context.params.query.offset === undefined || context.params.query.offset < 0 ? offset = 0 : offset = context.params.query.offset;

        //Filter by country
        const admin0 = context.params.query.admin0 ? { admin0: context.params.query.admin0 } : undefined;

        //Filter by datetime
        const dateoccurence = context.params.query.datetime ? context.params.query.datetime.split('/').length > 1 ? {
            dateoccurence: {
                [Op.between]: [
                    context.params.query.datetime.split('/')[0],
                    context.params.query.datetime.split('/')[1]
                ]
            }
        } : {
            dateoccurence: context.params.query.datetime.split('/')[0]
        } : undefined;

        //Filter by resolution
        const resolved = context.params.query.resolved ? { resolved: context.params.query.resolved } : undefined;

        let bboxCrs: string;
        context.params.query['bbox-crs'] === undefined || context.params.query === "https://www.opengis.net/def/crs/OGC/1.3/CRS84" ? bboxCrs = "http://www.opengis.net/def/crs/EPSG/0/4326" : bboxCrs = context.params.query['bbox-crs'];

        const bboxParameters = {
            minx: (context.params.query.bbox === undefined ? undefined : context.params.query.bbox[0]),
            maxx: (context.params.query.bbox === undefined ? undefined : context.params.query.bbox[1]),
            maxy: (context.params.query.bbox === undefined ? undefined : context.params.query.bbox[2]),
            miny: (context.params.query.bbox === undefined ? undefined : context.params.query.bbox[3]),
            lon: (context.params.query.radius === undefined ? undefined : context.params.query.radius[0]),
            lat: (context.params.query.radius === undefined ? undefined : context.params.query.radius[1]),
            radiusDistance: (context.params.query.radius == undefined ? undefined : context.params.query.radius[2]), // Add a default radius if none is provided
            bboxSrid: parseInt(bboxCrs.split('/').pop())
        };

        //Actual bbox filter
        const bbox = context.params.query.bbox ? {
            bbox: sequelize.literal('ST_Contains(ST_Transform(ST_MakeEnvelope(:minx, :maxx, :maxy, :miny, :bboxCrs), 4326), "incidents"."geom") is true')
        } : undefined;

        //Let the user define the crs of the output. Default is 4326
        let crs: string;
        context.params.query.crs === undefined || context.params.query === "https://www.opengis.net/def/crs/OGC/1.3/CRS84" ? crs = "http://www.opengis.net/def/crs/EPSG/0/4326" : crs = context.params.query.crs;

        const columnDetails = await customColumnDetails(crs)
        const validCRS = await verifyCRS(crs);
        const validbboxCRS = await verifyCRS(bboxCrs);

        if (!validCRS || validCRS.length < 1 || validbboxCRS.length < 1) {
            context.res.status(400).setBody({ message: "invalid crs" })
        } else {
            try {
                const { count, rows } = await Coups.findAndCountAll({
                    attributes: columnDetails,
                    include: [attributes_l0],
                    where: {
                        [Op.and]: [
                            admin0,
                            dateoccurence,
                            resolved,
                            bbox
                        ]
                    },
                    order: [['coupid', 'ASC']],
                    includeIgnoreAttributes: false,
                    replacements: bboxParameters,
                    limit: limit,
                    offset: offset,
                    raw: true
                });
                const { nextPageOffset, prevPageOffset } = calcPaging(count, limit, offset);
                const links = await genLinks4featurecollection(collectionId, prevPageOffset, nextPageOffset, limit);

                //Create geoJSON
                async function makeGeoJSON() {
                    if (rows.length < 1 || !rows) {
                        context.res.status(404);
                    } else {
                        let featuresArray = [];
                        if (rows.length > 1) {
                            featuresArray = rows.map(item => {
                                const { type, coordinates } = item.geom;
                                const { coupid, dateoccurence, resolved, country, resolutiondate } = item;
                                return {
                                    type: 'Feature',
                                    geometry: {
                                        type,
                                        coordinates
                                    },
                                    id: coupid,
                                    properties: {
                                        dateoccurence,
                                        resolved,
                                        country,
                                        resolutiondate
                                    }
                                }
                            });
                        } else {
                            featuresArray = [
                                {
                                    type: 'Feature',
                                    geometry: {
                                        type: rows[0].type,
                                        coordinates: rows[0].coordinates
                                    },
                                    id: rows[0].coupid,
                                    properties: {
                                        dateoccurence: rows[0].dateoccurence,
                                        resolved: rows[0].resolved,
                                        country: rows[0].country,
                                        resolutiondate: rows[0].resolutiondate
                                    }
                                }
                            ];
                        }
                        const featurecollection = await createFCobject(count, rows.length, featuresArray, links);
                        //return featuresArray;
                        context.res
                            .status(200)
                            .set('content-crs',crs)
                            .set('content-type','application/json')
                            //.set('content-type','application/geo+json')
                            .setBody(featurecollection)
                    }
                }
                await makeGeoJSON();
            } catch (error) {
                context.res.status(500) //Server error
            }
        }
    }
}

exports.getOneCoup = async function getOneCoup(context) {

}

exports.deleteOneCoup = async function deleteOneCoup(context) {
    context.res.status(200).setBody({ message: "invalid config" })

}

exports.updateCoups = async function updateCoups(context) {
    context.res.status(200).setBody({ message: "invalid config" })

}

exports.addCoups = async function addCoups(context) {
    context.res.status(200).setBody({ message: "invalid config" })

}