//import { genLinks4collections } from "./linksGen";
//import { storageCRS,trs } from "./coreVars";
import db = require("../../models");
const { QueryTypes } = require("sequelize");
import { getCRSArray } from "./validateCRS";
import { genLinks4collections } from "./linksGen";

export async function generateCollectionInfo(
    collectionId: string,
    storageCRS: Array<string>,
    listAllCRS: boolean,
    trs: string,
    storageCrsCoordinateEpoch: number
) {
    let dateTimeMin: any,
        dateTimeMax: any,
        datetimeColumn: string,
        bbox: any,
        bboxArray: Array<any>,
        bboxMinx: number,
        bboxMaxx: number,
        bboxMaxy: number,
        bboxMiny: number,
        intervalArray: Array<any>;

    if (collectionId === 'incidents') {
        bbox = await db.sequelize.query(`select st_setsrid(st_extent(geom),4326) as bbox from ${collectionId}`, { type: QueryTypes.SELECT })
        bboxMinx = bbox[0]["bbox"]["coordinates"][0][0][0];
        bboxMiny = bbox[0]["bbox"]["coordinates"][0][0][1];
        bboxMaxx = bbox[0]["bbox"]["coordinates"][0][2][0];
        bboxMaxy = bbox[0]["bbox"]["coordinates"][0][2][1];
        bboxArray = [[bboxMinx, bboxMaxx, bboxMaxy, bboxMiny]];

        datetimeColumn = 'dateoccurence';

        dateTimeMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        dateTimeMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        intervalArray = [[dateTimeMin[0]["min"], dateTimeMax[0]["max"]]];

    } else if (collectionId === "coups") {
        
        bbox = await db.sequelize.query(`select st_setsrid(st_extent(level0.geom),4326) as bbox from ${collectionId} inner join level0 on ${collectionId}.admin0=level0.admin0`, { type: QueryTypes.SELECT });
        bboxMinx = bbox[0]["bbox"]["coordinates"][0][0][0];
        bboxMiny = bbox[0]["bbox"]["coordinates"][0][0][1];
        bboxMaxx = bbox[0]["bbox"]["coordinates"][0][2][0];
        bboxMaxy = bbox[0]["bbox"]["coordinates"][0][2][1];
        bboxArray = [[bboxMinx, bboxMaxx, bboxMaxy, bboxMiny]];

        datetimeColumn = 'dateoccurence';
        dateTimeMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        dateTimeMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

        intervalArray = [[dateTimeMin[0]["min"], dateTimeMax[0]["max"]]];
    } else if (collectionId === "conflicts") {
        let dateoccurenceMin: any, dateoccurenceMax: any, enddateMin: any, enddateMax: any;

        bbox = await db.sequelize.query(`select st_setsrid(st_extent(geom),4326) as bbox from ${collectionId} inner join level0 on level0.admin0 = ${collectionId}.admin0;`, { type: QueryTypes.SELECT });
        bboxMinx = bbox[0]["bbox"]["coordinates"][0][0][0];
        bboxMiny = bbox[0]["bbox"]["coordinates"][0][0][1];
        bboxMaxx = bbox[0]["bbox"]["coordinates"][0][2][0];
        bboxMaxy = bbox[0]["bbox"]["coordinates"][0][2][1];
        bboxArray = [[bboxMinx, bboxMaxx, bboxMaxy, bboxMiny]];

        datetimeColumn = 'startdate';
        dateoccurenceMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        dateoccurenceMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

        datetimeColumn = 'enddate';
        enddateMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        enddateMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        intervalArray = [[dateoccurenceMin[0]["min"], dateoccurenceMax[0]["max"]], [enddateMin[0]["min"], enddateMax[0]["max"]]];

    } else if (collectionId === 'goi') {
        bbox = await db.sequelize.query(`select st_setsrid(st_extent(level0.geom),4326) as bbox from ${collectionId} inner join level0 on ${collectionId}.admin0=level0.admin0`, { type: QueryTypes.SELECT });
        console.log(bbox)
        bboxMinx = bbox[0]["bbox"]["coordinates"][0][0][0];
        bboxMiny = bbox[0]["bbox"]["coordinates"][0][0][1];
        bboxMaxx = bbox[0]["bbox"]["coordinates"][0][2][0];
        bboxMaxy = bbox[0]["bbox"]["coordinates"][0][2][1];
        bboxArray = [[bboxMinx, bboxMaxx, bboxMaxy, bboxMiny]];

        intervalArray = [[null, null]];

    } else if (collectionId === 'traveladvisories') {
        let bboxX: any,
            bboxY: any,
            bboxMinxX: number,
            bboxMaxxX: number,
            bboxMaxyX: number,
            bboxMinyX: number,
            bboxMinxY: number,
            bboxMaxxY: number,
            bboxMaxyY: number,
            bboxMinyY: number,
            dateissuedMin: any,
            dateissuedMax: any,
            liftdateMin: any,
            liftdateMax: any;

        bboxX = await db.sequelize.query(`select st_setsrid(st_extent(level0.geom), 4326) as bbox from ${collectionId} inner join level0 on ${collectionId}.xcountry = level0.admin0;`, { type: QueryTypes.SELECT });
        bboxY = await db.sequelize.query(`select st_setsrid(st_extent(level0.geom), 4326) as bbox from ${collectionId} inner join level0 on ${collectionId}.ycountry = level0.admin0;`, { type: QueryTypes.SELECT });

        bboxMinxX = bboxX[0]["bbox"]["coordinates"][0][0][0];
        bboxMaxxX = bboxX[0]["bbox"]["coordinates"][0][2][0];
        bboxMaxyX = bboxX[0]["bbox"]["coordinates"][0][2][1];
        bboxMinyX = bboxX[0]["bbox"]["coordinates"][0][0][1];
        bboxMinxY = bboxY[0]["bbox"]["coordinates"][0][0][0];
        bboxMaxxY = bboxY[0]["bbox"]["coordinates"][0][2][0];
        bboxMaxyY = bboxY[0]["bbox"]["coordinates"][0][2][1];
        bboxMinyY = bboxY[0]["bbox"]["coordinates"][0][0][1];
        bboxArray = [[bboxMinxX, bboxMaxxX, bboxMaxyX, bboxMinyX], [bboxMinxY, bboxMaxxY, bboxMaxyY, bboxMinyY]];

        datetimeColumn = 'dateissued';
        dateissuedMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        dateissuedMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

        datetimeColumn = 'liftdate';
        liftdateMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        liftdateMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

        intervalArray = [[dateissuedMin[0]["min"], dateissuedMax["max"]], [liftdateMin[0]["min"], liftdateMax[0]["max"]]];
    }
    const links = await genLinks4collections(collectionId);
    async function genCRSArray() {
        if (listAllCRS == true) {
            return getCRSArray();
        } else {
            return ["#/crs", ...storageCRS]
        }
    }
    //genCRSArray();
    const crs = await genCRSArray();
    const metadata = {
        id: collectionId,
        title: `Collection ${collectionId}`,
        description: `Collection ${collectionId} description`,
        extent: {
            spatial: {
                bbox: bboxArray,
                crs: storageCRS
            },
            termporal: {
                interval: intervalArray,
                trs: trs
            }

        },
        itemType: "feature",
        crs: crs,
        storageCRS: storageCRS,
        storageCrsCoordinateEpoch: storageCrsCoordinateEpoch,
        links: links
    }
    return metadata;
}