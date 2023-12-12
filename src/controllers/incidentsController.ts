import * as sequelize from 'sequelize';
import * as models from '../models';
/**
 * This file contains the incidents controller.
 * It handles the logic for managing incidents.
 */
/**
 * Controller for handling incidents.
 */
/**
 * This file imports the required models for the incidents controller.
 * The imported models are level0, level1, level2, level3, level4, level5, goi, and conflicts.
 */

const { level0, level1, level2, level3, level4, level5, goi, conflicts } = require('../models');
const Incidents = models.incidents;
const { Op } = require('sequelize');
import { createServerLinks } from '../core/serverlinking';
import { validateParams } from './core/validParamsFun';
import { genLinks4feature, genLinks4featurecollection } from './core/linksGen';
import calcPaging from './core/paging';
import { verifyCRS } from './core/validateCRS';
import { createFCobject } from './core/makeFCobject';
/**
 * Retrieves the custom column details for a given CRS.
 * @param crs - The Coordinate Reference System (CRS) to use. Defaults to EPSG:4326. 
 * @returns An array of column details.
 */

async function customColumnDetails(crs: string) {
    const columnDetails = [
        'incidentid',
        'dateoccurence',
        'incidentdesc',
        'category',
        'locale',
        [
            sequelize.fn('ST_Transform', sequelize.col('"incidents"."geom"'), parseInt(crs.split('/').pop())), 'geom'
        ],
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
    ]
    return columnDetails
}

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
            'admin0',
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
        const collectionId = 'incidents';
        let f: string;
        let limit: number;
        let offset: number;

        // Set f='json' by default
        context.params.query.f === undefined ? f = 'json' : f = context.params.query.f;

        // set offset to 0 by default
        context.params.query.offset === undefined || context.params.query.offset < 0 ? offset = 0 : offset = context.params.query.offset;

        // set limit to 10 by default
        context.params.query.limit === undefined ? limit = 10 : limit = context.params.query.limit; // set limit to 10 by default}

        // Filter by administrative units from admin0 to admin5
        const admin0 = context.params.query.admin0 ? { admin0: context.params.query.admin0 } : undefined;
        const admin1 = context.params.query.admin1 ? { admin1: context.params.query.admin1 } : undefined;
        const admin2 = context.params.query.admin2 ? { admin2: context.params.query.admin2 } : undefined;
        const admin3 = context.params.query.admin3 ? { admin3: context.params.query.admin3 } : undefined;
        const admin4 = context.params.query.admin4 ? { admin4: context.params.query.admin4 } : undefined;
        const admin5 = context.params.query.admin5 ? { admin5: context.params.query.admin5 } : undefined;

        // Filter by category
        const category = context.params.query.category ? { category: context.params.query.category } : undefined;

        // Filter by incidentdesc. A more quality algorithm will be implemented
        const incidentdesc = context.params.query.incidentdesc ? { incidentdesc: { [Op.like]: context.params.query.incidentdesc } } : undefined;

        // Filter by radius. radiusDistance is in metres. End user must make their own conversions.
        const radius = context.params.query.radius ? { radius: sequelize.literal('st_distancesphere("incidents"."geom",st_makepoint(:lon,:lat)) <= :radiusDistance') } : undefined;


        /**
         * Represents the date occurrence filter for incidents.
         * If a datetime value is entered by the user, dateoccurence is initialized
         * to look for incidents that happened between the provided date range.
         * If the datetime value is a single date, dateoccurence is set to that date.
         * If two datetimes are provided, dateoccurence is set to the range between the two dates.
         * If no datetime value is provided, dateoccurence is undefined.
         */

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

        /**
         * contains replacements for placeholders in the query
         * @param bbox - Is a four box array containing values for bbox
         * @param radius - Is a three box array. Takes in longitude, latitude and radiusDistance in that order  
         * @bboxCrs - The Coordinate Reference System (CRS) to use. Defaults to EPSG:4326.
         */
        let bboxCrs: string;
        context.params.query['bbox-crs'] === undefined || context.params.query['bbox-crs'] === "https://www.opengis.net/def/crs/OGC/1.3/CRS84" ? bboxCrs = "http://www.opengis.net/def/crs/EPSG/0/4326" : bboxCrs = context.params.query['bbox-crs'];
        let crs: string;
        context.params.query.crs === undefined || context.params.query.crs === "https://www.opengis.net/def/crs/OGC/1.3/CRS84" ? crs = "http://www.opengis.net/def/crs/EPSG/0/4326" : crs = context.params.query.crs;
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

        //console.log(context.params.query.crs)
        //console.log(context.params.query['bbox-crs'])
        const columnDetails = await customColumnDetails(crs);

        if ((await verifyCRS(crs)).length < 1 || (await verifyCRS(bboxCrs)).length < 1) {
            context.res.status(400).setBody({ message: 'Invalid CRS. Please use a valid CRS' });
        } else {
            try {
                // Query the database
                const { count, rows } = await Incidents.findAndCountAll({
                    attributes: columnDetails,
                    include: [
                        attributes_l0,  // Include the attributes from the level0 model
                        attributes_l1,  // Include the attributes from the level1 model
                        attributes_l2,  // Include the attributes from the level2 model
                        attributes_l3,  // Include the attributes from the level3 model
                        attributes_l4,  // Include the attributes from the level4 model
                        attributes_l5,  // Include the attributes from the level5 model
                        attributes_goi, // Include the attributes from the goi model
                        attributes_conflicts    // Include the attributes from the conflicts model
                    ],
                    where: { // count,
                        [Op.and]: {
                            geom: {
                                [Op.ne]: null //Does not include null geometries
                            },
                            [Op.and]: [ // Filter by the following parameters. Or is instead of and.
                                incidentdesc,
                                admin0,
                                admin1,
                                admin2,
                                admin3,
                                admin4,
                                admin5,
                                category,
                                bbox,
                                dateoccurence,
                                radius
                            ]

                        }
                    },
                    order: [
                        ['incidentid', 'ASC'] // Order by incidentid in ascending order. Enables constistent offset
                    ],
                    includeIgnoreAttributes: false, // Disables the generation of non-existent fields referring to foreign keys
                    replacements: bboxParameters,
                    limit: limit, // Filters number of results returned to user
                    offset: offset, // Enables pagination
                    raw: true
                });
                console.log(count)
                console.log(rows.length)
                //offsets
                const { nextPageOffset, prevPageOffset } = await calcPaging(count, limit, offset);

                //generate links
                const links = await genLinks4featurecollection(collectionId, prevPageOffset, nextPageOffset, limit);

                //generate a geojsonFeature/FeatureCollection dependent on a few factors
                async function makeGeoJSON() {
                    if (rows.length < 1 || !rows) {
                        context.res.status(404) //If rows object is empty, return 404
                    } else {
                        let featuresArray: Array<any> = [];
                        if (rows.length > 1) {
                            featuresArray = rows.map(item => {
                                const { type, coordinates } = item.geom;
                                const { incidentid,
                                    dateoccurence,
                                    incidentdesc,
                                    groupname,
                                    conflictname,
                                    category,
                                    locale,
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
                                        country,
                                        name_1,
                                        name_2,
                                        name_3,
                                        name_4,
                                        name_5
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
                                id: rows[0].incidentid,
                                properties: {
                                    dateoccurence: rows[0].dateoccurence,
                                    incidentdesc: rows[0].incidentdesc,
                                    groupname: rows[0].groupname,
                                    conflictname: rows[0].conflictname,
                                    category: rows[0].category,
                                    locale: rows[0].locale,
                                    country: rows[0].country,
                                    name_1: rows[0].name_1,
                                    name_2: rows[0].name_2,
                                    name_3: rows[0].name_3,
                                    name_4: rows[0].name_4,
                                    name_5: rows[0].name_5
                                }
                            }];
                        }
                        //console.log(rows)
                        const featurecollection = await createFCobject(count, rows.length, featuresArray, links);
                        context.res
                            .status(200)
                            .set('content-crs', `<${crs}>`)
                            .set('content-type', 'application/geo+json')
                            .set('content-type', 'application/json')
                            .setBody(featurecollection);
                    }
                }
                await makeGeoJSON()
            } catch (error) {
                context.res.status(500).setBody({ message: error }) //Server error
            }
        }
    }
}

exports.getOneIncident = async function getOneIncident(context) {
    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400);
    } else {

        const incidentid = context.params.path.featureId;
        let f: string;
        !context.params.query.f ? f = 'json' : f = context.params.query.f; // Set f='json' by default

        let crs: string;
        context.params.query.crs === undefined || context.params.query === "https://www.opengis.net/def/crs/OGC/1.3/CRS84" ? crs = "http://www.opengis.net/def/crs/EPSG/0/4326" : crs = context.params.query.crs;

        const columnDetails = await customColumnDetails(crs);
        const validCRS = await verifyCRS(crs);
        if (!validCRS || validCRS.length < 1) {
            context.res.status(400).setBody({ message: 'Invalid CRS. Please use a valid CRS' });
        } else {
            try {
                const rows = await Incidents.findByPk(incidentid, {
                    attributes: columnDetails,
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
                const links = await genLinks4feature('incidents', incidentid);
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
                                country: rows.country,
                                name_1: rows.name_1,
                                name_2: rows.name_2,
                                name_3: rows.name_3,
                                name_4: rows.name_4,
                                name_5: rows.name_5
                            },
                            links: links
                        };
                        context.res
                            .status(200)
                            .set('content-crs', `<${crs}>`)
                            .set('content-type', 'application/json')
                            .set('content-type', 'application/geo+json')
                            .setBody(feature);
                    }
                }
                await makeGeoJSON();
            } catch (error) {
                context.res.status(500);
            }
        }
    }
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
        const category = context.requestBody.features[0].properties.category;
        const incidentdesc = context.requestBody.features[0].properties.incidentdesc;
        const groupid = context.requestBody.features[0].properties.groupid;
        const conflictid = context.requestBody.features[0].properties.conflictid;
        const geom = context.requestBody.features[0].geometry;
        const locale = context.requestBody.features[0].properties.locale;
        const rows = await Incidents.create({
            dateoccurence: dateoccurence,
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
    let crs: string;
    this.context.params.query.crs === undefined ? crs = "urn:ogc:def:crs:EPSG:4326" : crs = this.context.params.query.crs.split(':')[5];
    const columnDetails = await customColumnDetails(crs);
    const rows = await Incidents.findAll({
        attributes: columnDetails,
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