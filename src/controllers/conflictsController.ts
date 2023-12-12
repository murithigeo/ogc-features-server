import * as sequelize from 'sequelize';
import { createServerLinks } from '../core/serverlinking';
import { validateParams } from './validParamsFun';
const { level0 } = require('../models');
const { Op } = require('sequelize');
const Conflicts = require('../models').conflicts;

const defaultAttributes = [
    'conflictid',
    'conflictname',
    'admin0',
    'startdate',
    'enddate',
    'overviewuri',
    [
        sequelize.col('"level0"."country"'), 'country'
    ],
    [
        sequelize.literal('ST_Simplify("level0"."geom", 0.001)'), 'geom'
    ]
];
const attributes_l0 = {
    model: level0,
    attributes: {
        exclude: ['admin0'],
        include: ['geom']
    }
};

exports.getAllConflicts = async function getAllConflicts(context) {
    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400);
    } else {
        let f: string, limit: any, offset: any;
        const { baseURL } = await createServerLinks();
        context.params.query.f === undefined ? f = 'json' : f = context.params.query.f;
        context.params.query.offset == undefined || context.params.query.offset < 0 || context.params.query.offset == 'NaN' ? offset = 0 : offset = context.params.query.offset; // If user input is less than 0, set defined offset as 0. Otherwise set to requested offset
        context.params.query.limit == undefined ? limit = 10 : context.params.query.limit == 'unlimited' ? limit = null : limit = context.params.query.limit; // set limit to 10 by default}

        const admin0 = context.params.query.admin0 ? {
            admin0: context.params.query.admin0
        } : undefined;
        // Filter by bounding box
        const bbox = context.params.query.bbox ? {
            bbox: sequelize.literal('st_contains(st_makeenvelope(:minx,:miny,:maxx,:maxy,4326),"geom") is true')
        } : undefined;
        // Filter by radius. radiusDistance is in metres. End user must make their own conversions.
        const radius = context.params.query.radius ? {
            radius: sequelize.literal('st_distancesphere("geom",st_makepoint(:lon,:lat)) <= :radiusDistance')
        } : undefined;

        // Nested ternary operator:
        const startdate = context.params.query.datetime ? context.params.query.datetime.split('/').length > 1 ? { // If datetime value is entered by user, dateoccurence is init
            startdate: { // When '/' separated value detected and items>1, then look for incidents that happened on between provided daterange
                [Op.between]: [
                    context.params.query.datetime.split('/')[0],
                    context.params.query.datetime.split('/')[1]
                ]
            } // Otherwise, if stringSplit array has does not have more than two items, then look for incidents on particular date
        } : {
            startedate: context.params.query.datetime.split('/')[0]
        } : undefined;
        // Filter by Eventdesc. Uses like to match characters. Future Implementation will use a more advanced algorithm
        const conflictname = context.params.query.conflictname ? {
            conflictname: {
                [Op.like]: context.params.query.conflictname
            }
        } : undefined;
        // Replacement values for bounding box queries since sequelize does not support native POSTGIS/Postgres Functions
        const bboxParameters = {
            minx: (context.params.query.bbox == undefined ? undefined : context.params.query.bbox[0]),
            miny: (context.params.query.bbox == undefined ? undefined : context.params.query.bbox[1]),
            maxx: (context.params.query.bbox == undefined ? undefined : context.params.query.bbox[2]),
            maxy: (context.params.query.bbox == undefined ? undefined : context.params.query.bbox[3]),
            lon: (context.params.query.radius == undefined ? undefined : context.params.query.radius[0]),
            lat: (context.params.query.radius == undefined ? undefined : context.params.query.radius[1]),
            radiusDistance: (context.params.query.radius == undefined ? undefined : context.params.query.radius[2]), // Add a default radius if none is provided
        };
        const { count, rows } = await Conflicts.findAndCountAll({
            attributes: defaultAttributes,
            include: [attributes_l0],
            where: {
                [Op.and]: [
                    admin0,
                    startdate,
                    radius,
                    bbox,
                    conflictname
                ]
            },
            includeIgnoreAttributes: false,
            replacements: bboxParameters,
            limit: limit,
            offset: offset,
            raw: true
        });

        const maxOffset: number = count - limit;
        let nextPageOffset: number = offset + limit;
        let prevPageOffset: number = offset - limit;
        nextPageOffset > maxOffset ? nextPageOffset = maxOffset : nextPageOffset = nextPageOffset;
        prevPageOffset > maxOffset ? prevPageOffset = maxOffset : prevPageOffset = prevPageOffset;

        async function makeGeoJSON() {
            if (rows.length < 1 || !rows) {
                context.res.status(404)
            }
            else {
                if (rows.length > 1) {
                    const featuresArray = rows.map(item => {
                        const { type, coordinates } = item.geom;
                        const { conflictid,
                            conflictname,
                            country,
                            startdate,
                            enddate,
                            overviewuri } = item;
                        return {
                            type: 'Feature',
                            geometry: {
                                type,
                                coordinates
                            },
                            id: conflictid,
                            properties: {
                                conflictname,
                                country,
                                startdate,
                                enddate,
                                overviewuri
                            }
                        };
                    });
                    const featurecollection = {
                        type: 'FeatureCollection',
                        timeStamp: new Date().toJSON(),
                        numberMatched: count,
                        numberReturned: rows.length,
                        features: featuresArray,
                        links: [
                            {
                                href: baseURL + "/collections/incidents/items?f=json", // f to be added laters
                                rel: "self",
                                type: "application/json", // geo+json and json are interoperable
                                title: "Incidents Collection"
                            }, {
                                href: baseURL + "/collections/incidents/items?f=html", // FeatureCollection as html
                                rel: "alternate",
                                type: "text/html",
                                title: "IncidentsFeatureCollection as HTML"
                            }, {
                                href: baseURL + "/collections/incidents/items?f=json&offset=" + nextPageOffset + "&limit=" + limit,
                                rel: "next",
                                type: "application/json",
                                title: "next page"
                            }, {
                                href: baseURL + "/collections/incidents/items?f=json&offset=" + prevPageOffset + "&limit=" + limit,
                                rel: "previous",
                                type: "application/json",
                                title: "Previous page"
                            }
                        ]
                    };
                    context.res
                        .status(200)
                        .set('content-type', 'application/json')
                        .set('content-type', 'application/geo+json')
                        .setBody(featurecollection);
                }
                else {
                    const featuresArray = {
                        type: 'Feature',
                        geometry: {
                            type: rows[0].geom.type,
                            coordinates: rows[0].geom.coordinates
                        },
                        id: rows[0].conflictid,
                        properties: {
                            conflictid: rows[0].conflictid,
                            conflictname: rows[0].conflictname,
                            country: rows[0].country,
                            startdate: rows[0].startdate,
                            enddate: rows[0].enddate,
                            overviewuri: rows[0].overviewuri
                        }
                    };
                    const featurecollection = {
                        type: 'FeatureCollection',
                        timeStamp: new Date().toJSON(),
                        numberMatched: count,
                        numberReturned: rows.length,
                        features: featuresArray,
                        links: [
                            {
                                href: baseURL + '/collections/conflicts/items?f=' + f,
                                rel: 'self',
                                type: 'application/geo+json',
                                title: 'conflictsCollection'
                            }, {
                                href: baseURL + '/collections/conflicts/items?f=' + 'html',
                                rel: 'alternate',
                                type: 'text/html',
                                title: 'as HTML'
                            }, {
                                href: baseURL + '/collections/conflicts/items?f=' + f + '&offset=' + nextPageOffset + '&limit=' + limit,
                                rel: 'next',
                                type: 'application/geo+json',
                                title: 'nextPage'
                            }, {
                                href: baseURL + '/collections/conflicts/items?f=' + f + '&offset=' + prevPageOffset + '&limit=' + limit,
                                rel: 'previous',
                                type: 'application/geo+json',
                                title: 'previous page'
                            }]
                    };
                    context.res
                        .status(200)
                        .set('content-type', 'application/json')
                        .set('content-type', 'application/geo+json')
                        .setBody(featurecollection);
                }
            }
        }
        await makeGeoJSON();
    }

}

exports.getOneConflict = async function getOneConflict(context) {
    const { baseURL } = await createServerLinks();
    const conflictid = context.params.path.featureId;
    let f: any;
    context.params.query.f === undefined ? f = 'json' : f = context.params.query.f;

    const rows = await Conflicts.findByPk(conflictid, {
        attributes: defaultAttributes,
        include: [attributes_l0],
        includeIgnoreAttributes: false,
        raw: true
    });
    async function makeGeoJSON() {
        if (!rows || rows.length < 1) {
            context.res.status(404);
        } else {
            const feature = {
                type: 'Feature',
                id: rows.conflictid,
                geometry: {
                    type: rows.geom.type,
                    coordinates: rows.geom.coordinates
                },
                properties: {
                    conflictname: rows.conflictid,
                    country: rows.country,
                    startdate: rows.startdate,
                    enddate: rows.enddate,
                    overviewuri: rows.overviewuri
                },
                links: [
                    {
                        href: baseURL + "/collections/conflicts/items/" + rows.conflictid + "?f=json",
                        rel: "self",
                        type: "application/geo+json",
                        title: "Requested Object: " + rows.conflictid + " as JSON"
                    }, {
                        href: baseURL + "/collections/conflicts/items/" + rows.conflictid + "?f=html",
                        rel: "alternate",
                        type: "text/html",
                        title: "Requested Object: " + rows.conflictid + " as HTML"
                    }, {
                        href: baseURL + "/collections/conflicts/items/f=json",
                        rel: "collection",
                        type: "application/geo+json",
                        title: "Link to main collection"
                    }
                ]
            };
            context.res
                .status(200)
                .set('content-type', 'application/json')
                .set('content-type', 'application/geo+json')
                .setBody(feature);
        }

    };
    await makeGeoJSON()
}


exports.deleteOneConflict = async function deleteOneConflict(context) {
    context.res.status(200).setBody({ message: "invalid config" })

}

exports.updateConflicts = async function updateConflicts(context) {
    context.res.status(200).setBody({ message: "invalid config" })

}

exports.addConflicts = async function addConflicts(context) {
    context.res.status(200).setBody({ message: "invalid config" })

}