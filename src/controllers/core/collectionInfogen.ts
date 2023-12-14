//import { genLinks4collections } from "./linksGen";
//import { storageCRS,trs } from "./coreVars";
import db = require("../../models");
const { QueryTypes } = require("sequelize");
import { getCRSArray } from "./CRS";
import { genLinks4collections } from "./linksGen";

export async function genbboxArray(bbox: Array<any>) {
    const bboxMinx: number = bbox[0]["bbox"]["coordinates"][0][0][0];
    const bboxMiny: number = bbox[0]["bbox"]["coordinates"][0][0][1];
    const bboxMaxx: number = bbox[0]["bbox"]["coordinates"][0][2][0];
    const bboxMaxy: number = bbox[0]["bbox"]["coordinates"][0][2][1];
    const bboxArray = [bboxMinx, bboxMiny, bboxMaxx, bboxMaxy];
    return bboxArray;
};
export async function genDates4Interval(dateMinUn: Array<any>, dateMaxUn: Array<any>) {
    const dateMin: string = dateMinUn[0]["min"];
    const dateMax: string = dateMaxUn[0]["max"];
    const intervals: Array<string> = [dateMin, dateMax];
    return intervals;
};

export async function generateCollectionInfo(
    collectionId: string,
    storageCRS: Array<string>,
    listAllCRS: boolean,
    trs: string,
    storageCrsCoordinateEpoch: number,
    obj: any
) {
    let dateTimeMin: any,
        dateTimeMax: any,
        datetimeColumn: string,
        bbox: any,
        bboxArray: Array<any>,
        extent: Array<any>,
        intervalArray: Array<any>;



    if (collectionId === 'incidents') {
        bbox = await db.sequelize.query(`select st_setsrid(st_extent(geom),4326) as bbox from ${collectionId}`, { type: QueryTypes.SELECT });
        bboxArray = await genbboxArray(bbox);
        extent = [bboxArray];

        datetimeColumn = 'dateoccurence';
        dateTimeMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        dateTimeMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

        const dates0 = await genDates4Interval(dateTimeMin, dateTimeMax);

        intervalArray = [dates0];
    } else if (collectionId === "coups") {

        bbox = await db.sequelize.query(`select st_setsrid(st_extent(level0.geom),4326) as bbox from ${collectionId} inner join level0 on ${collectionId}.admin0=level0.admin0`, { type: QueryTypes.SELECT });
        bboxArray = await genbboxArray(bbox);
        extent = [bboxArray];

        datetimeColumn = 'dateoccurence';
        dateTimeMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        dateTimeMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        intervalArray = await genDates4Interval(dateTimeMin, dateTimeMax);

    } else if (collectionId === "conflicts") {
        let dateoccurenceMin: any, dateoccurenceMax: any, enddateMin: any, enddateMax: any;
        bbox = await db.sequelize.query(`select st_setsrid(st_extent(geom),4326) as bbox from ${collectionId} inner join level0 on level0.admin0 = ${collectionId}.admin0;`, { type: QueryTypes.SELECT });
        bboxArray = await genbboxArray(bbox);
        bboxArray = [bboxArray];

        datetimeColumn = 'startdate';
        dateoccurenceMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        dateoccurenceMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

        const datesStart = await genDates4Interval(dateoccurenceMin, dateoccurenceMax);

        datetimeColumn = 'enddate';
        enddateMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        enddateMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

        const datesEnd = await genDates4Interval(enddateMin, enddateMax);
        intervalArray = [datesStart, datesEnd];

    } else if (collectionId === 'goi') {
        bbox = await db.sequelize.query(`select st_setsrid(st_extent(level0.geom),4326) as bbox from ${collectionId} inner join level0 on ${collectionId}.admin0=level0.admin0`, { type: QueryTypes.SELECT });
        bboxArray = await genbboxArray(bbox);
        extent = [bboxArray];
        intervalArray = [[null, null]];
    } else if (collectionId === 'traveladvisories') {
        let bboxX: any,
            bboxY: any,
            dateissuedMin: any,
            dateissuedMax: any,
            liftdateMin: any,
            liftdateMax: any;

        bboxX = await db.sequelize.query(`select st_setsrid(st_extent(level0.geom), 4326) as bbox from ${collectionId} inner join level0 on ${collectionId}.xcountry = level0.admin0;`, { type: QueryTypes.SELECT });
        bboxY = await db.sequelize.query(`select st_setsrid(st_extent(level0.geom), 4326) as bbox from ${collectionId} inner join level0 on ${collectionId}.ycountry = level0.admin0;`, { type: QueryTypes.SELECT });

        bboxX = await genbboxArray(bboxX);

        bboxY = await genbboxArray(bboxY);

        bboxArray = [bboxX, bboxY];

        datetimeColumn = 'dateissued';
        dateissuedMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        dateissuedMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        const datesIssued = await genDates4Interval(dateissuedMin, dateissuedMax);

        datetimeColumn = 'liftdate';
        liftdateMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
        liftdateMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

        const datesLifted = await genDates4Interval(liftdateMin, liftdateMax);
        intervalArray = [datesIssued, datesLifted];
    }
    const links = await genLinks4collections(collectionId, obj);
    async function genCRSArray() {
        if (listAllCRS == true) {
            return await getCRSArray();
        } else {
            return [...storageCRS]
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
                bbox: extent,
                crs: storageCRS[0]
            },
            termporal: {
                interval: intervalArray,
                trs: trs
            }
        },
        itemType: "feature",
        crs: crs,
        storageCrs: storageCRS[0],
        storageCrsCoordinateEpoch: storageCrsCoordinateEpoch,
        links: links
    }
    return metadata;
}