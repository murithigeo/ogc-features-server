import { QueryTypes } from "sequelize";
import * as db from "../models";

//import the baseURL
import { createServerLinks } from "../core/serverlinking";
import { validateParams } from "./validParamsFun";
import { genLinks4collections, genMainLinks } from "./core/linksGen";

const srsNameTemplate: string = "urn:ogc:def:crs:EPSG:";

//Define Reference Systems
const storageCRS = srsNameTemplate + 4326;
const trs: string = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";


async function incidentsCollection() {
    const { baseURL } = await createServerLinks(); //Init incidentsCollection

    const dateTimeMin = await db.sequelize.query("select MIN(dateoccurence) from incidents;", { type: QueryTypes.SELECT });
    const dateTimeMax = await db.sequelize.query("select MAX(dateoccurence) from incidents;", { type: QueryTypes.SELECT });

    //To reduce the number of queries, we could use just one query
    const bbox = await db.sequelize.query("select st_setsrid(st_extent(geom), 4326) as bbox from incidents;", { type: QueryTypes.SELECT });

    const bboxMinx = bbox[0]["bbox"]["coordinates"][0][0][0];
    //await db.sequelize.query("select st_xmin(st_setsrid(st_extent(geom), 4326)) as minx from incidents;", { type: QueryTypes.SELECT });
    const bboxMaxx = bbox[0]["bbox"]["coordinates"][0][2][0];
    //await db.sequelize.query("select st_xmax(st_setsrid(st_extent(geom), 4326)) as maxx from incidents;", { type: QueryTypes.SELECT });

    const bboxMaxy = bbox[0]["bbox"]["coordinates"][0][2][1];
    //await db.sequelize.query("select st_ymax(st_setsrid(st_extent(geom), 4326)) as maxy from incidents;", { type: QueryTypes.SELECT });

    const bboxMiny = bbox[0]["bbox"]["coordinates"][0][0][1];
    //await db.sequelize.query("select st_ymin(st_setsrid(st_extent(geom), 4326)) as miny from incidents;", { type: QueryTypes.SELECT });
    const links = await genLinks4collections('incidents');

    const incidentsMetadata = {
        id: "incidents",
        title: "[Security Incidents] collection",
        description: "IncidentsCollection",
        extent: {
            spatial: {
                bbox: [[
                    bboxMinx,
                    bboxMaxx,
                    bboxMaxy,
                    bboxMiny
                ]],
                crs: storageCRS
            },
            temporal: {
                interval: [
                    [
                        dateTimeMin[0]["min"],
                        dateTimeMax[0]["max"]
                    ]
                ],
                trs: trs
            }
        },
        itemType: "feature",
        crs: [
            storageCRS
        ],
        storageCrs: storageCRS,
        links: links
    };
    return incidentsMetadata;
}

async function conflictsCollection() {
    const { baseURL } = await createServerLinks();

    const dateTimeMax = await db.sequelize.query("select MAX(startdate) from conflicts;", { type: QueryTypes.SELECT });
    const dateTimeMin = await db.sequelize.query("select MIN(startdate) from conflicts;", { type: QueryTypes.SELECT });
    const bbox = await db.sequelize.query("select st_setsrid(st_extent(l0.geom),4326) as bbox from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMinx = bbox[0]["bbox"]["coordinates"][0][0][0];
    //await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom),4326)) as minx from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxx = bbox[0]["bbox"]["coordinates"][0][2][0];
    //await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom),4326)) as maxx from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxy = bbox[0]["bbox"]["coordinates"][0][2][1];
    //await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom),4326)) as maxy from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMiny = bbox[0]["bbox"]["coordinates"][0][0][1];
    //await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom),4326)) as miny from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const links = await genLinks4collections('conflicts');

    const conflictsMedata = {
        id: "conflicts",
        title: "conflictsCollection",
        description: "contains conflicts",
        extent: {
            spatial: {
                bbox: [
                    [
                        bboxMinx,
                        bboxMaxx,
                        bboxMaxy,
                        bboxMiny
                    ]
                ],
                crs: storageCRS
            },
            temporal: {
                interval: [
                    [
                        dateTimeMin[0]["min"],
                        dateTimeMax[0]["max"]
                    ]
                ],
                trs: trs
            }
        },
        itemType: "feature",
        crs: [
            storageCRS
        ],
        storageCrs: storageCRS,
        links: links
    };
    return conflictsMedata
}
async function coupsCollection() {
    const dateTimeMin = await db.sequelize.query("select MIN(dateoccurence) from coups;", { type: QueryTypes.SELECT });
    const dateTimeMax = await db.sequelize.query("select MAX(dateoccurence) from coups;", { type: QueryTypes.SELECT });
    const bbox = await db.sequelize.query("select st_setsrid(st_extent(l0.geom), 4326) as bbox from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMinx = bbox[0]["bbox"]["coordinates"][0][0][0];
    //await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom), 4326)) as minx from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxx = bbox[0]["bbox"]["coordinates"][0][2][0];
    //await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom), 4326)) as maxx from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxy = bbox[0]["bbox"]["coordinates"][0][2][1];
    //await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom), 4326)) as maxy from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMiny = bbox[0]["bbox"]["coordinates"][0][0][1];
    //await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom), 4326)) as miny from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });
    const links = await genLinks4collections('coups');
    const coupsMetadata = {
        id: "coups",
        title: "coups",
        description: "contains coups",
        extent: {
            spatial: {
                bbox: [
                    [
                        bboxMinx,
                        bboxMaxx,
                        bboxMaxy,
                        bboxMiny
                    ]
                ],
                crs: storageCRS
            },
            temporal: {
                interval: [
                    [
                        dateTimeMin[0]["min"],
                        dateTimeMax[0]["max"]
                    ]
                ],
                trs: trs
            }
        },
        itemType: "feature",
        crs: [
            "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        ],
        links: links
    };
    return coupsMetadata;
}

async function goiCollection() {
    const bbox = await db.sequelize.query("select st_setsrid(st_extent(l0.geom), 4326) as bbox from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMinx = bbox[0]["bbox"]["coordinates"][0][0][0];
    //await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom), 4326)) as minx from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxx = bbox[0]["bbox"]["coordinates"][0][2][0];
    //await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom), 4326)) as maxx from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxy = bbox[0]["bbox"]["coordinates"][0][2][1];
    //await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom), 4326)) as maxy from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMiny = bbox[0]["bbox"]["coordinates"][0][0][1];
    //await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom), 4326)) as miny from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });

    const links = await genLinks4collections('goi');

    const goiMetadata = {
        id: "goi",
        title: "groupsofInterest",
        description: "contains goi",
        extent: {
            spatial: {
                bbox: [
                    [
                        bboxMinx,
                        bboxMaxx,
                        bboxMaxy,
                        bboxMiny
                    ]
                ],
                crs: storageCRS
            },
            temporal: {
                interval: [
                    [
                        null, null // goiN[0]["dateTimeMin"], coupNewest[0]["dateTimeMax"]
                    ]
                ],
                trs: trs
            }
        },
        itemType: "feature",
        crs: [
            "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        ],
        storageCrs: storageCRS,
        links: links
    };
    return goiMetadata;
}

async function traveladvisoriesCollection() {

    //Interval: dateissued
    const dateTimeMinIssued = await db.sequelize.query("select MIN(dateissued) from traveladvisories;", { type: QueryTypes.SELECT });
    const dateTimeMaxIssued = await db.sequelize.query("select MAX(dateissued) from traveladvisories;", { type: QueryTypes.SELECT });

    //Interval: liftdate
    const dateTimeMinLift = await db.sequelize.query("select MIN(liftdate) from traveladvisories;", { type: QueryTypes.SELECT });
    const dateTimeMaxLift = await db.sequelize.query("select MAX(liftdate) from traveladvisories;", { type: QueryTypes.SELECT });

    //Xcountry
    const bboxX = await db.sequelize.query("select st_setsrid(st_extent(l0.geom), 4326) as bbox from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMinxXcountry = bboxX[0]["bbox"]["coordinates"][0][0][0];
    //const bboxMinxXcountry = await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom), 4326)) as minx from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxxXcountry = bboxX[0]["bbox"]["coordinates"][0][2][0];
    //const bboxMaxxXcountry = await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom), 4326)) as maxx from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxyXcountry = bboxX[0]["bbox"]["coordinates"][0][2][1];
    //const bboxMaxyXcountry = await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom), 4326)) as maxy from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMinyXcountry = bboxX[0]["bbox"]["coordinates"][0][0][1];
    //const bboxMinyXcountry = await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom), 4326)) as miny from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });

    //Ycountry
    const bboxY = await db.sequelize.query("select st_setsrid(st_extent(l0.geom), 4326) as bbox from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMinxYcountry = bboxY[0]["bbox"]["coordinates"][0][0][0];
    //const bboxMinxYcountry = await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom), 4326)) as minx from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxxYcountry = bboxY[0]["bbox"]["coordinates"][0][2][0];
    //const bboxMaxxYcountry = await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom), 4326)) as maxx from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMaxyYcountry = bboxY[0]["bbox"]["coordinates"][0][2][1];
    //const bboxMaxyYcountry = await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom), 4326)) as maxy from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });

    const bboxMinyYcountry = bboxY[0]["bbox"]["coordinates"][0][0][1];
    //const bboxMinyYcountry = await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom), 4326)) as miny from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });

    // Links
    const links = await genLinks4collections('traveladvisories');

    const traveladvisoriesMetadata = {
        id: "traveladvisories",
        title: "Travel Adv.",
        description: "TA",
        extent: {
            spatial: {
                bbox: [
                    [
                        bboxMinxXcountry,
                        bboxMaxxXcountry,
                        bboxMaxyXcountry,
                        bboxMinyXcountry
                    ],
                    [
                        bboxMinxYcountry,
                        bboxMaxxYcountry,
                        bboxMaxyYcountry,
                        bboxMinyYcountry
                        // Targeted Countries BBOX
                    ]
                ],
                crs: storageCRS
            },
            temporal: {
                interval: [
                    [
                        dateTimeMinIssued[0]["min"],
                        dateTimeMaxIssued[0]["max"]
                    ],
                    [
                        dateTimeMinLift[0]["min"],
                        dateTimeMaxLift[0]["max"]
                    ]
                ],
                trs: trs
            }
        },
        itemType: "feature",
        crs: [
            storageCRS
        ],
        storageCrs: storageCRS,
        links: links
    };
    return traveladvisoriesMetadata;
}

exports.getAllCollections = async function getAllCollections(context) {
    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        const { baseURL } = await createServerLinks();
        const goiMetadata = await goiCollection();
        const incidentsMetadata = await incidentsCollection();
        const conflictsMetadata = await conflictsCollection();
        const traveladvisoriesMetadata = await traveladvisoriesCollection();
        const coupsMetadata = await coupsCollection();
        const mainLinks = await genMainLinks();

        const collections = {
            title: "Available datasets",
            links: mainLinks,
            collections: [
                incidentsMetadata,
                conflictsMetadata,
                coupsMetadata,
                goiMetadata,
                traveladvisoriesMetadata
            ]
        };
        context.res
            .status(200)
            .set('content-type', 'application/json')
            .setBody(collections);
    }
}
exports.getOneCollection = async function getOneCollection(context) {
    const unexpectedParams = await validateParams(context);
    if (unexpectedParams.length > 0) {
        context.res.status(400)
    } else {
        const collectionId = context.params.path.collectionId;
        switch (collectionId) {
            case 'incidents':
                const incidentsMetadata = await incidentsCollection();
                //console.log(context.params.query);
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(incidentsMetadata);
                break;
            case 'goi':
                const goiMetadata = await goiCollection();
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(goiMetadata);
                break;
            case 'conflicts':
                const conflictsMetadata = await conflictsCollection();
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(conflictsMetadata);
                break;
            case 'traveladvisories':
                const traveladvisoriesMetadata = await traveladvisoriesCollection();
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(traveladvisoriesMetadata);
                break;
            case 'coups':
                const coupsMetadata = await coupsCollection();
                context.res
                    .status(200)
                    .set('content-type', 'application/json')
                    .setBody(coupsMetadata);
                break;
        }
    }

}