import { QueryTypes } from "sequelize";
import * as db from "../models";

//import the baseURL
import { createServerLinks } from "../core/serverlinking";
import { validateParams } from "./validParamsFun";

//Define Reference Systems
const storageCRS: string = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
const trs: string = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";


async function incidentsCollection() {
    const { baseURL } = await createServerLinks(); //Init incidentsCollection

    const dateTimeMin = await db.sequelize.query("select MIN(dateoccurence) from incidents;", { type: QueryTypes.SELECT });
    const dateTimeMax = await db.sequelize.query("select MAX(dateoccurence) from incidents;", { type: QueryTypes.SELECT });
    //const bbox = await db.sequelize.query("select st_setsrid(st_extent(geom), 4326) as bbox from incidents;", { type: QueryTypes.SELECT });
    const bboxMinx = await db.sequelize.query("select st_xmin(st_setsrid(st_extent(geom), 4326)) as minx from incidents;", { type: QueryTypes.SELECT });
    const bboxMaxx = await db.sequelize.query("select st_xmax(st_setsrid(st_extent(geom), 4326)) as maxx from incidents;", { type: QueryTypes.SELECT });
    const bboxMaxy = await db.sequelize.query("select st_ymax(st_setsrid(st_extent(geom), 4326)) as maxy from incidents;", { type: QueryTypes.SELECT });
    const bboxMiny = await db.sequelize.query("select st_ymin(st_setsrid(st_extent(geom), 4326)) as miny from incidents;", { type: QueryTypes.SELECT });
    const links = [
        {
            href: baseURL + "/collections/incidents",
            rel: "self",
            title: "incidentsCollection"
        }, {
            href: baseURL + "/collections/incidents/items",
            rel: "items",
            title: "All incidents available in the collection",
            type: "application/geo+json" // Can also be application/geojson due to crosscompactibility. Future implementation of an exegesis geojson parser
        }, {
            href: baseURL + "/collections/incidents.gpkg",
            rel: "enclosure",
            type: "application/geopackage+sqlite3",
            title: "Bulk download all incidents(GeoPackage)",
            length: "TBD"
        }
    ];
    const incidentsMetadata = {
        id: "incidents",
        title: "[Security Incidents] collection",
        description: "IncidentsCollection",
        extent: {
            spatial: {
                bbox: [[
                    bboxMinx[0]["minx"],
                    bboxMaxx[0]["maxx"],
                    bboxMaxy[0]["maxy"],
                    bboxMiny[0]["miny"]
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
            "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
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
    const bboxMinx = await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom),4326)) as minx from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxx = await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom),4326)) as maxx from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxy = await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom),4326)) as maxy from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMiny = await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom),4326)) as miny from conflicts c inner join level0 l0 on c.admin0 = l0.admin0;", { type: QueryTypes.SELECT });
    const links = [
        {
            href: baseURL + "/collections/conflicts",
            rel: "self",
            title: "conflictsCollection"
        }, {
            href: baseURL + "/collections/conflicts/items",
            rel: "items",
            type: "application/geo+json",
            title: "conflicts"
        }, {
            href: baseURL + "/collections/conflicts.gpkg",
            rel: "enclosure",
            type: "application/geopackage+sqlite3",
            title: "Bulk download all incidents(GeoPackage)",
            length: "TBD"
        }
    ];
    const conflictsMedata = {
        id: "conflicts",
        title: "conflictsCollection",
        description: "contains conflicts",
        extent: {
            spatial: {
                bbox: [
                    [
                        bboxMinx[0]["minx"],
                        bboxMaxx[0]["maxx"],
                        bboxMaxy[0]["maxy"],
                        bboxMiny[0]["miny"]
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
        storageCrs: storageCRS,
        links: links
    };
    return conflictsMedata
}
async function coupsCollection() {
    const { baseURL } = await createServerLinks(); //Init incidentsCollection

    const dateTimeMin = await db.sequelize.query("select MIN(dateoccurence) from coups;", { type: QueryTypes.SELECT });
    const dateTimeMax = await db.sequelize.query("select MAX(dateoccurence) from coups;", { type: QueryTypes.SELECT });
    const bboxMinx = await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom), 4326)) as minx from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxx = await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom), 4326)) as maxx from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxy = await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom), 4326)) as maxy from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMiny = await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom), 4326)) as miny from coups co inner join level0 l0 on co.admin0 = l0.admin0;", { type: QueryTypes.SELECT });

    const links = [
        {
            href: baseURL + "/collections/coups",
            rel: "self",
            title: "coups"
        }, {
            href: baseURL + "/collections/coups/items",
            rel: "items",
            type: "application/json"
        }, {
            href: baseURL + "/collections/incidents.gpkg",
            rel: "enclosure",
            title: "Bulk download all coups(GeoPackage)",
            type: "application/geopackage+sqlite3",
            length: "TBD"
        }
    ];
    const coupsMetadata = {
        id: "coups",
        title: "coups",
        description: "contains coups",
        extent: {
            spatial: {
                bbox: [
                    [
                        bboxMinx[0]["minx"],
                        bboxMaxx[0]["maxx"],
                        bboxMaxy[0]["maxy"],
                        bboxMiny[0]["miny"]
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
    const { baseURL } = await createServerLinks(); //Init incidentsCollection
    const bboxMinx = await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom), 4326)) as minx from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxx = await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom), 4326)) as maxx from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxy = await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom), 4326)) as maxy from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMiny = await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom), 4326)) as miny from goi g inner join level0 l0 on g.origin = l0.admin0;", { type: QueryTypes.SELECT });
    const links = [
        {
            href: baseURL + "/collections/goi",
            rel: "self",
            title: "Groups of Interest"
        }, {
            href: baseURL + "/collections/goi/items",
            rel: "items",
            type: "application/geo+json"
        }, {
            href: baseURL + "/collections/goi.gpkg",
            rel: "enclosure",
            title: "Bulk download all goi(GeoPackage)",
            type: "application/geopackage+sqlite3",
            length: "TBD"
        }
    ];
    const goiMetadata = {
        id: "goi",
        title: "groupsofInterest",
        description: "contains goi",
        extent: {
            spatial: {
                bbox: [
                    [
                        bboxMinx[0]["minx"],
                        bboxMaxx[0]["maxx"],
                        bboxMaxy[0]["maxy"],
                        bboxMiny[0]["miny"]
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
    const { baseURL } = await createServerLinks(); //Init incidentsCollection

    const dateTimeMin = await db.sequelize.query("select MIN(dateissued) from traveladvisories;", { type: QueryTypes.SELECT });
    const dateTimeMax = await db.sequelize.query("select MIN(dateissued) from traveladvisories;", { type: QueryTypes.SELECT });

    //Xcountry
    const bboxMinxXcountry = await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom), 4326)) as minx from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxxXcountry = await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom), 4326)) as maxx from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxyXcountry = await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom), 4326)) as maxy from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMinyXcountry = await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom), 4326)) as miny from traveladvisories t_a inner join level0 l0 on t_a.xcountry = l0.admin0;", { type: QueryTypes.SELECT });

    //Ycountry
    const bboxMinxYcountry = await db.sequelize.query("select st_xmin(st_setsrid(st_extent(l0.geom), 4326)) as minx from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxxYcountry = await db.sequelize.query("select st_xmax(st_setsrid(st_extent(l0.geom), 4326)) as maxx from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMaxyYcountry = await db.sequelize.query("select st_ymax(st_setsrid(st_extent(l0.geom), 4326)) as maxy from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });
    const bboxMinyYcountry = await db.sequelize.query("select st_ymin(st_setsrid(st_extent(l0.geom), 4326)) as miny from traveladvisories t_a inner join level0 l0 on t_a.ycountry = l0.admin0;", { type: QueryTypes.SELECT });
    // Links
    const links = [
        {
            href: baseURL + "/collections/traveladvisories",
            rel: "self",
            title: "TravelAdvisories"
        }, {
            href: baseURL + "/collections/traveladvisories/items",
            rel: "items",
            type: "application/geo+json"
        }, {
            href: baseURL + "/collections/traveladvisories.gpkg",
            rel: "enclosure",
            type: "application/geopackage+sqlite3",
            title: "Bulk download all incidents(GeoPackage)",
            length: "TBD"
        }
    ];
    const traveladvisoriesMetadata = {
        id: "traveladvisories",
        title: "Travel Adv.",
        description: "TA",
        extent: {
            spatial: {
                bbox: [
                    [
                        bboxMinxXcountry[0]["minx"],
                        bboxMaxxXcountry[0]["maxx"],
                        bboxMaxyXcountry[0]["maxy"],
                        bboxMinyXcountry[0]["miny"]
                    ],
                    [
                        bboxMinxYcountry[0]["minx"],
                        bboxMaxxYcountry[0]["maxx"],
                        bboxMaxyYcountry[0]["maxy"],
                        bboxMinyYcountry[0]["miny"]
                        // Targeted Countries BBOX
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
        const mainLinks = [
            {
                href: baseURL + "/collections?f=json",
                rel: "self",
                type: "application/json",
                title: "This document"
            },
            // Not implemented yet
            {
                href: baseURL + "/collections?f=html",
                rel: "alternate",
                type: "text/html",
                title: "Doc as html"
            },
            // Export all data. Not implemented yet
            {
                "href": baseURL + "/collections/all.gpkg",
                "rel": "enclosure",
                "type": "application/geopackage+sqlite3",
                "title": "Download all data"
            }
        ];
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