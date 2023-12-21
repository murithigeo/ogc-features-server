import * as sequelize from 'sequelize';
import * as models from '../models';
const { Op } = sequelize;
const Gtdb = models.gtdb;
import { validateQueryParams } from './core/validParamsFun';
import { genLinks4feature, genLinks4featurecollection } from './core/linksGen';
import { verify_use_CRS } from './core/CRS';
import { createFCobject } from './core/makeFCobject';
import { defCommonQueryParams } from './core/commonParams';

async function customColumnDetails(crs: string) {
    const columnDetails = [
        'eventid',
        'dateoccurence',
        'summary',
        [
            sequelize.fn('ST_Transform', sequelize.col('"gtdb"."geom"'), (await verify_use_CRS(crs))[0].srid), 'geom'
        ],
        [
            sequelize.col('"gtdb"."targtype1_txt"'), 'target'
        ],
        [
            sequelize.col('"gtdb"."gname"'), 'groupname'
        ]
    ];
    return columnDetails;
}

exports.getAllEvents = async function getAllEvents(context) {
    if ((await validateQueryParams(context)).length > 0) {
        context.res.status(400);
    } else {
        const { f,prevPageOffset,nextPageOffset, offset, limit, bboxCrs, crs, contentCrs, spatialQueryParamsReplacements, bbox, radius } = await defCommonQueryParams(context, sequelize, 'gtdb');
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

        if ((await verify_use_CRS(crs)).length < 1 || (await verify_use_CRS(bboxCrs)).length < 1) {
            context.res.status(400).setBody('Invalid CRS');
        } else {
            try {
                const { count, rows } = await Gtdb.findAndCountAll({
                    attributes: await customColumnDetails(crs),
                    where: {
                        [Op.and]: {
                            geom: {
                                [Op.ne]: null
                            },
                            [Op.and]: [
                                bbox,
                                dateoccurence,
                                radius
                            ]
                        }
                    },
                    order: [['summary', 'ASC']],
                    includeIgnoreAttributes: false,
                    replacements: spatialQueryParamsReplacements,
                    limit: limit,
                    offset: offset,
                    raw: true
                });
                //const { nextPageOffset, prevPageOffset } = await calcPaging(count, limit, offset);
                const links = await genLinks4featurecollection('gtdb', prevPageOffset, nextPageOffset, limit, context);

                async function makeGeoJSON() {
                    let featuresArray: Array<any> = [];
                    if (rows.length < 1) {
                        featuresArray=[];
                    } else {
                        if (rows.length > 1) {
                            featuresArray = rows.map(item => {
                                const { type, coordinates } = item.geom;
                                const {
                                    eventid,
                                    summary,
                                    dateoccurence,
                                    groupname,
                                    target,
                                    adm1,
                                    adm0,
                                    adm2,
                                    adm3,
                                    adm4,
                                    adm5
                                } = item;
                                return {
                                    type: 'Feature',
                                    geometry: {
                                        type,
                                        coordinates
                                    },
                                    id: eventid,
                                    properties: {
                                        dateoccurence,
                                        summary,
                                        groupname,
                                        target,
                                        adm0,
                                        adm1,
                                        adm2,
                                        adm3,
                                        adm4,
                                        adm5
                                    }
                                }
                            });
                        } else {
                            featuresArray = [{
                                type: 'Feature',
                                geometry: {
                                    type: rows[0].geom.type,
                                    coordinates: rows[0].geom.coordinates
                                },
                                id: rows[0].eventid,
                                properties: {
                                    dateoccurence: rows[0].dateoccurence,
                                    summary: rows[0].summary,
                                    groupname: rows[0].groupname,
                                    target: rows[0].target,
                                    adm0: rows[0].adm0,
                                    adm1: rows[0].adm1,
                                    adm2: rows[0].adm2,
                                    adm3: rows[0].adm3,
                                    adm4: rows[0].adm4,
                                    adm5: rows[0].adm5
                                }
                            }];
                        }
                        
                    }
                    const featurecollection = await createFCobject(count, rows.length, featuresArray, links);
                        context.res
                            .status(200)
                            .set('content-crs', contentCrs)
                            .set('content-type', 'application/geo+json')
                            .set('content-type', 'application/json')
                            .setBody(featurecollection);
                }
                await makeGeoJSON();
            } catch (err) {
                console.log(err);
                context.res.status(500);
            }
        }
    }
}
exports.getOneEvent = async function getOneEvent(context) {
    if ((await validateQueryParams(context)).length > 0) {
        context.res.status(400)
    } else {
        try {
            const { f, crs, contentCrs } = await defCommonQueryParams(context, sequelize, 'gtdb');
            const rows = await Gtdb.findByPk(context.params.path.featureId, {
                attributes: await customColumnDetails(crs),
                includeIgnoreAttributes: false,
                raw: true
            });
            async function makeGeoJSON() {
                if (rows.length < 1) {
                    context.res.status(404).setBody('No features found');
                } else {
                    const feature = {
                        type: 'Feature',
                        geometry: {
                            type: rows.geom.type,
                            coordinates: rows.geom.coordinates
                        },
                        id: rows.eventid,
                        properties: {
                            dateoccurence: rows.dateoccurence,
                            summary: rows.summary,
                            groupname: rows.groupname,
                            target: rows.target,
                            adm0: rows.adm0,
                            adm1: rows.adm1,
                            adm2: rows.adm2,
                            adm3: rows.adm3,
                            adm4: rows.adm4,
                            adm5: rows.adm5
                        },
                        links: await genLinks4feature('gtdb', rows.eventid, context)
                    };
                    context.res
                        .status(200)
                        .set('content-crs', contentCrs)
                        .set('content-type', 'application/geo+json')
                        .set('content-type', 'application/json')
                        .setBody(feature);
                }
            };
            await makeGeoJSON();
        } catch (err) {
            console.log(err);
            context.res.status(500);
        }
    }
}


export async function exportEvents(crs: string){
    const rows = await Gtdb.findAll({
        attributes: await customColumnDetails(crs),
        where: {
            geom: {
                [Op.ne]: null
            }
        },
        order: [['dateoccurence', 'ASC']],
        includeIgnoreAttributes: false,
        raw: true
    });
    const featuresArray = rows.map(item => {
        const { type, coordinates } = item.geom;
        const {
            eventid,
            summary,
            dateoccurence,
            groupname,
            target
        } = item;
        return {
            type: 'Feature',
            geometry: {
                type,
                coordinates
            },
            properties: {
                id: eventid,
                dateoccurence,
                summary,
                groupname,
                target
            }
        }
    });
    const featurecollection = {
        type: 'FeatureCollection',
        features: featuresArray
    };
    return featurecollection;
}