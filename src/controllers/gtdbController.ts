import * as sequelize from 'sequelize';
import models from '../models';
const { Op } = sequelize;
const Gtdb = models.gtdb;
import { validateQueryParams } from './core/validParamsFun';
import { createLinks4Feature, createLinks4FeatureCollection } from './core/createLinks';
import { createFeatureCollection } from './core/createFeatureCollection';
import { defCommonQueryParams, pagingDef } from './core/commonParams';

async function customColumnDetails(crsCheck: Array<any>, flipCoords: boolean) {
    const transformQuery = flipCoords === false ?
        [sequelize.fn('ST_Transform', sequelize.col('"gtdb"."geom"'), crsCheck[0].srid), 'geom']
        : [sequelize.fn(`ST_FlipCoordinates`, sequelize.fn(`ST_Transform`, sequelize.col(`"gtdb"."geom"`), crsCheck[0].srid)), 'geom']
    const columnDetails = [
        'eventid',
        'dateoccurence',
        'summary',
        'adm0',
        'adm1',
        'adm2',
        'adm3',
        'adm4',
        'adm5',
        transformQuery,
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
        const { f,
            datetime,
            offset,
            limit,
            contentCrs,
            bbox,
            radius,
            bboxCrsCheck, crsCheck,
            flipCoords,
        } = await defCommonQueryParams(context, sequelize, 'gtdb');

        if (bboxCrsCheck.length < 1 || crsCheck.length < 1) {
            context.res.status(400).setBody('Invalid CRS');
        } else {
            try {
                const { count, rows } = await Gtdb.findAndCountAll({
                    attributes: await customColumnDetails(crsCheck, flipCoords),
                    where: {
                        [Op.and]: {
                            geom: {
                                [Op.ne]: null
                            },
                            [Op.and]: [
                                bbox,
                                datetime,
                                radius
                            ]
                        }
                    },
                    order: [['eventid', 'ASC']],
                    includeIgnoreAttributes: false,
                    //replacements: spatialQueryParamsReplacements,
                    limit: limit,
                    offset: offset,
                    raw: true
                });
                const { nextPageOffset, prevPageOffset,numberReturned } = await pagingDef(count, offset, limit);
                const links = await createLinks4FeatureCollection('gtdb', context, offset, offset-limit, prevPageOffset, nextPageOffset);
                async function makeGeoJSON() {
                    let featuresArray: Array<any> = [];
                    if (rows.length < 1) {
                        featuresArray = [];
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
                    const featurecollection = await createFeatureCollection(numberReturned, featuresArray, links,count);
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
        const { f, crs, contentCrs, crsCheck, flipCoords } = await defCommonQueryParams(context, sequelize, 'gtdb');
        if (crsCheck.length < 1) {
            context.res.status(400).setBody('Invalid CRS');
        } else {
            try {
                const rows = await Gtdb.findByPk(context.params.path.featureId, {
                    attributes: await customColumnDetails(crsCheck, flipCoords),
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
                            links: await createLinks4Feature('gtdb', rows.eventid, context)
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
}


export async function exportEvents(context) {
    const { crsCheck, flipCoords } = await defCommonQueryParams(context, 'null', 'gtdb',)
    const rows = await Gtdb.findAll({
        attributes: await customColumnDetails(crsCheck, flipCoords),
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