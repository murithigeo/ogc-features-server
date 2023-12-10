import * as sequelize from 'sequelize';
import * as models from '../models';
const { level0, level1, level2, level3, level4, level5, goi, conflicts } = require('../models');
const Incidents = models.incidents;
const { Op } = require('sequelize');
//import * as Op from 'sequelize';
import { createServerLinks } from '../core/serverlinking';
import * as queryString from "querystring";
import { validateParams } from './validParamsFun';
// Speficify resulting fieldnames
const defaultAttributes = [
    'incidentid',
    'dateoccurence',
    'geom',
    'success',
    'incidentdesc',
    'category',
    'locale',
    [
        sequelize.col('"level0"."country"'), 'country'
    ],
    [
        sequelize.col('"level1"."name_1"'), 'name_1'
    ],
    [
        sequelize.col('"level2"."name_2"'), 'name_2'
    ],
    [
        sequelize.col('"level3"."name_3"'), 'name_3'
    ],
    [
        sequelize.col('"level4"."name_4"'), 'name_4'
    ],
    [
        sequelize.col('"level5"."name_5"'), 'name_5'
    ],
    [
        sequelize.col('"goi"."groupname"'), 'groupname'
    ],
    [
        sequelize.col('"conflict"."conflictname"'), 'conflictname'
    ]
];

// Will be used in other models, therefore should be a global attribute
const attributes_l0 = {
    model: level0,
    attributes: {
        exclude: ['admin0']
    }
};
const attributes_l1 = {
    model: level1,
    attributes: {
        exclude: ['admin1']
    }
};
const attributes_l2 = {
    model: level2,
    attributes: {
        exclude: ['admin2']
    }
};
const attributes_l3 = {
    model: level3,
    attributes: {
        exclude: ['admin3']
    }
};
const attributes_l4 = {
    model: level4,
    attributes: {
        exclude: ['admin4']
    }
};
const attributes_l5 = {
    model: level5,
    attributes: {
        exclude: ['admin5']
    }
};
const attributes_goi = {
    model: goi,
    attributes: {
        exclude: [
            'id',
            'groupid',
            'category',
            'origin',
            'uri',
            'dateadd',
            'dateupdate'
        ]
    }
};
const attributes_conflicts = {
    model: conflicts,
    attributes: {
        exclude: [
            'id',
            'admin0',
            'conflictid',
            'startdate',
            'enddate',
            'overviewuri',
            'dateadd',
            'dateupdate'
        ]
    }
};


exports.getAllIncidents = async function getAllIncidents(context) {

    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400);
    } else {
        let f: string;
        let limit: number;
        let offset: number;
        const { baseURL } = await createServerLinks();
        //To be implemented after geoJSON compliance complete
        context.params.query.f === undefined ? f = 'json' : f = context.params.query.f;
        context.params.query.offset == undefined || context.params.query.offset < 0 || context.params.query.offset == 'NaN' ? offset = 0 : offset = context.params.query.offset; // If user input is less than 0, set defined offset as 0. Otherwise set to requested offset
        context.params.query.limit == undefined ? limit = 10 :  limit = context.params.query.limit; // set limit to 10 by default}
        // Filter by success
        const success = context.params.query.success ? {
            success: context.params.query.success
        } : undefined;
        // Filter by admin0......admin5
        const admin0 = context.params.query.admin0 ? {
            admin0: context.params.query.admin0
        } : undefined;
        const admin1 = context.params.query.admin1 ? {
            admin1: context.params.query.admin1
        } : undefined;
        const admin2 = context.params.query.admin2 ? {
            admin2: context.params.query.admin2
        } : undefined;
        const admin3 = context.params.query.admin3 ? {
            admin3: context.params.query.admin3
        } : undefined;
        const admin4 = context.params.query.admin4 ? {
            admin4: context.params.query.admin4
        } : undefined;
        const admin5 = context.params.query.admin5 ? {
            admin5: context.params.query.admin5
        } : undefined;

        // Filter by category
        const category = context.params.query.category ? {
            category: context.params.query.category
        } : undefined;

        // Filter by incidentdesc. Uses like to match characters. Future Implementation will use a more advanced algorithm
        const incidentdesc = context.params.query.incidentdesc ? {
            incidentdesc: {
                [Op.like]: context.params.query.incidentdesc
            }
        } : undefined;

        // Filter by bounding box
        const bbox = context.params.query.bbox ? {
            bbox: sequelize.literal('st_contains(st_makeenvelope(:minx,:miny,:maxx,:maxy,4326),"incidents"."geom") is true')
        } : undefined;
        // Filter by radius. radiusDistance is in metres. End user must make their own conversions.
        const radius = context.params.query.radius ? {
            radius: sequelize.literal('st_distancesphere("incidents"."geom",st_makepoint(:lon,:lat)) <= :radiusDistance')
        } : undefined;
        // Future support to be added for geocoded gtdb entries. As is, only records having geodata will be used.
        // Nested ternary operator:
        const dateoccurence = context.params.query.datetime ? context.params.query.datetime.split('/').length > 1 ? { // If datetime value is entered by user, dateoccurence is init
            dateoccurence: { // When '/' separated value detected and items>1, then look for incidents that happened on between provided daterange
                [Op.between]: [
                    context.params.query.datetime.split('/')[0],
                    context.params.query.datetime.split('/')[1]
                ]
            } // Otherwise, if stringSplit array has does not have more than two items, then look for incidents on particular date
        } : {
            dateoccurence: context.params.query.datetime.split('/')[0]
        } : undefined;
        // Filter by incident.admin0 !== goi.origin

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

        //Retrieve data from db through defined models
        const { count, rows } = await Incidents.findAndCountAll({
            attributes: defaultAttributes,
            include: [
                attributes_l0,
                attributes_l1,
                attributes_l2,
                attributes_l3,
                attributes_l4,
                attributes_l5,
                attributes_goi,
                attributes_conflicts
            ],
            where: { // count,
                [Op.and]: {
                    geom: {
                        [Op.ne]: null // All values have geometries/Field is not null
                    },
                    [Op.and]: [
                        incidentdesc,
                        success,
                        admin0,
                        admin1,
                        admin2,
                        admin3,
                        admin4,
                        admin5,
                        category,
                        bbox,
                        dateoccurence,
                        radius,
                        // datasource
                    ]

                }
            },
            order: [
                ['incidentid', 'ASC']
            ],
            includeIgnoreAttributes: false, // Disables the generation of non-existent fields referring to foreign keys
            replacements: bboxParameters,
            // offset: offset,
            limit: limit, // Filters number of results returned to user
            offset: offset,// Enables pagination
            // plain: true,
            raw: true
        });

        //Calculate next & prev page offsets and looping pagination for use in serverRendering
        const maxOffset: number = count - limit; //max allowable pagination
        let nextPageOffset = offset + limit;
        let prevPageOffset = offset - limit;
        nextPageOffset > maxOffset ? nextPageOffset = maxOffset : nextPageOffset = nextPageOffset;
        prevPageOffset > maxOffset ? prevPageOffset = maxOffset : prevPageOffset = prevPageOffset;

        //generate a geojsonFeature/FeatureCollection dependent on a few factors
        async function makeGeoJSON() {
            if (rows.length < 1 || !rows) {
                context.res.status(404) //since dbResponse is empty, return not found code
            } else {
                if (rows.length > 1) {
                    const featuresArray = rows.map(item => {
                        const { type, coordinates } = item.geom;
                        const { incidentid,
                            dateoccurence,
                            incidentdesc,
                            groupname,
                            conflictname,
                            category,
                            locale,
                            success,
                            country,
                            name_1,
                            name_2,
                            name_3,
                            name_4,
                            name_5
                        } = item;
                        return {
                            type: 'Feature',
                            geometry: {
                                type,
                                coordinates
                            },
                            id: incidentid,
                            properties: {
                                dateoccurence,
                                incidentdesc,
                                groupname,
                                conflictname,
                                category,
                                locale,
                                success,
                                country,
                                name_1,
                                name_2,
                                name_3,
                                name_4,
                                name_5
                            }
                        }
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
                    }
                    context.res
                        .status(200)
                        .set('content-type', 'application/json')
                        .set('content-type', 'application/geo+json')
                        .setBody(featurecollection);
                } else {
                    const featuresArray = {
                        type: 'Feature',
                        geometry: {
                            type: rows[0].geom.type,
                            coordinates: rows[0].geom.coordinates
                        },
                        id: rows[0].incidentid,
                        properties: {
                            dateoccurence: rows[0].dateoccurence,
                            incidentdesc: rows[0].incidentdesc,
                            groupname: rows[0].groupname,
                            conflictname: rows[0].conflictname,
                            category: rows[0].category,
                            locale: rows[0].locale,
                            success: rows[0].success,
                            country: rows[0].country,
                            name_1: rows[0].name_1,
                            name_2: rows[0].name_2,
                            name_3: rows[0].name_3,
                            name_4: rows[0].name_4,
                            name_5: rows[0].name_5
                        }
                    };
                    const featureCollection = {
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
                        .set('content-type', 'application/geo+json')
                        .set('content-type', 'application/json')
                        .setBody(featureCollection);
                }
            }
        }
        await makeGeoJSON()
    }

}
exports.getOneIncident = async function getOneIncident(context) {
    const { baseURL } = await createServerLinks();
    const incidentid = context.params.path.featureId;
    let f: string;
    !context.params.query.f ? f = 'json' : f = context.params.query.f; // Set f='json' by default
    const rows = await Incidents.findByPk(incidentid, {
        attributes: defaultAttributes,
        include: [
            attributes_l0,
            attributes_l1,
            attributes_l2,
            attributes_l3,
            attributes_l4,
            attributes_l5,
            attributes_goi,
            attributes_conflicts,
        ],
        includeIgnoreAttributes: false,
        raw: true
    });
    async function makeGeoJSON() {
        if (rows < 1 || !rows) {
            context.res.status(404);
        } else {
            const feature = {
                type: 'Feature',
                geometry: {
                    type: rows.geom.type,
                    coordinates: rows.geom.coordinates
                },
                id: rows.incidentid,
                properties: {
                    dateoccurence: rows.dateoccurence,
                    incidentdesc: rows.incidentdesc,
                    groupname: rows.groupname,
                    conflictname: rows.conflictname,
                    category: rows.category,
                    locale: rows.locale,
                    success: rows.success,
                    country: rows.country,
                    name_1: rows.name_1,
                    name_2: rows.name_2,
                    name_3: rows.name_3,
                    name_4: rows.name_4,
                    name_5: rows.name_5
                },
                links: [
                    {
                        href: baseURL + "/collections/incidents/items/" + rows.incidentid + "?f=json",
                        rel: "self",
                        type: "application/geo+json",
                        title: "This Feature"
                    }, {
                        href: baseURL + "/collections/incidents/items/" + rows.incidentid + "?f=html",
                        rel: "alternate",
                        type: "text/html",
                        title: "Feature as HTML"
                    }, {
                        href: baseURL + "/collections/incidents/items?f=json",
                        rel: "collection",
                        type: "application/json",
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
    }
    await makeGeoJSON();
}


exports.deleteOneIncident = async function deleteOneIncident(context) {
    const incidentid = context.params.path.featureId;
    const rows = await Incidents.findByPk(incidentid);
    if (!rows) {
        context.res.status(404);
    } else {
        await Incidents.destroy({
            where: {
                incidentid: incidentid
            }
        });
        context.res.status(200).setBody('Deleted Incident: ' + incidentid + ' Successfully.')
    }
}

exports.updateIncidents = async function updateIncidents(context) {
    if (context.requestBody.features.length > 1) {
        const updateArray = context.requestBody.features.map(item => {
            const { geom } = item.geometry;
            const {
                incidentid,
                dateoccurence,
                success,
                category,
                eventdesc,
                groupid,
                conflictid,
                locale
            } = item.properties;
            return {
                incidentid,
                geom,
                dateoccurence,
                success,
                category,
                eventdesc,
                groupid,
                conflictid,
                locale
            };
        });
        const rows = await Incidents.bulkCreate(updateArray, { updateOnDuplicate: ["incidentid"] });
        context.res.status(200).setBody(rows);
    } else {
        const rowsFind = await Incidents.findByPk(context.requestBody.features[0].properties.incidentid);
        if (!rowsFind) {
            context.res.status(404);
        } else {
            rowsFind.eventdesc = context.requestBody.features[0].properties.eventdesc;
            rowsFind.dateoccurence = context.requestBody.features[0].properties.dateoccurence;
            rowsFind.success = context.requestBody.features[0].properties.success;
            rowsFind.category = context.requestBody.features[0].properties.category;
            rowsFind.groupid = context.requestBody.features[0].properties.groupid;
            rowsFind.conflictid = context.requestBody.features[0].properties.conflictid;
            rowsFind.geom = context.requestBody.features[0].geometry;
            rowsFind.locale = context.requestBody.features[0].properties.locale;
            const rowsSave = await rowsFind.save();
            context.res.status(200).setBody(rowsSave);
        }
    }

}

exports.addIncidents = async function addIncidents(context) {
    if (context.requestBody.features.length < 2) {
        const dateoccurence = context.requestBody.features[0].properties.dateoccurence;
        const success = context.requestBody.features[0].properties.success;
        const category = context.requestBody.features[0].properties.category;
        const incidentdesc = context.requestBody.features[0].properties.incidentdesc;
        const groupid = context.requestBody.features[0].properties.groupid;
        const conflictid = context.requestBody.features[0].properties.conflictid;
        const geom = context.requestBody.features[0].geometry;
        const locale = context.requestBody.features[0].properties.locale;
        const rows = await Incidents.create({
            dateoccurence: dateoccurence,
            success: success,
            conflictid: conflictid,
            incidentdesc: incidentdesc,
            groupid: groupid,
            locale: locale,
            category: category,
            geom: geom
        });
        context.res.status(200).setBody(rows);
    } else {
        const alterArray = context.requestBody.features.map(item => {
            const { type, coordinates } = item.geometry;
            const {
                incidentid,
                dateoccurence,
                success,
                conflictid,
                groupid,
                incidentdesc,
                locale,
                category
            } = item.properties;
            return {
                // type: 'Feature',
                geom: {
                    type,
                    coordinates
                },
                incidentid,
                dateoccurence,
                success,
                conflictid,
                groupid,
                incidentdesc,
                locale,
                category
            };
        });
        const rows = await Incidents.bulkCreate(alterArray);
        context.res.status(200).setBody(rows);
    }
}
export async function downloadIncidents() {
    const rows = await Incidents.findAll({
        attributes: defaultAttributes,
        include: [
            attributes_conflicts,
            attributes_goi,
            attributes_l0,
            attributes_l1,
            attributes_l2,
            attributes_l3,
            attributes_l4,
            attributes_l5,
        ],
        where: {
            [Op.and]: {
                geom: {
                    [Op.ne]: null
                }
            }
        },
        order: [['incidentid', 'ASC']],
        includeIgnoreAttributes: false,
        raw: true
    });
    const featuresArray = rows.map(item => {
        const { type, coordinates } = item.geom;
        const { incidentid,
            dateoccurence,
            incidentdesc,
            groupname,
            conflictname,
            category,
            locale,
            success,
            country,
            name_1,
            name_2,
            name_3,
            name_4,
            name_5
        } = item;
        return {
            type: 'Feature',
            geometry: {
                type,
                coordinates
            },
            properties: {
                incidentid,
                dateoccurence,
                incidentdesc,
                groupname,
                conflictname,
                category,
                locale,
                success,
                country,
                name_1,
                name_2,
                name_3,
                name_4,
                name_5
            }
        }
    });
    const featurecollection = {
        type: 'FeatureCollection',
        features: featuresArray
    };
    return featurecollection;
}