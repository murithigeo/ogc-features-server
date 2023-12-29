import { storageCrsCoordinateEpoch, storageCRS, trs, supportedCRS } from "../core/global.variables";
import db from "../../../models";
import { links4collections } from "../links";
const { QueryTypes } = require("sequelize");

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
    //storageCRS: Array<string>,
    listAllCRS: boolean,
    //trs: string,
    //storageCrsCoordinateEpoch: number,
    context: any
) {
    let dateTimeMin: any,
        dateTimeMax: any,
        datetimeColumn: string,
        bbox: any,
        bboxArray: Array<any>,
        extent: Array<any>,
        intervalArray: Array<any>;

    bbox = await db.sequelize.query(`select st_setsrid(st_extent(geom),4326) as bbox from ${collectionId}`, { type: QueryTypes.SELECT });
    bboxArray = await genbboxArray(bbox);
    extent = [bboxArray];

    datetimeColumn = 'dateoccurence';
    dateTimeMin = await db.sequelize.query(`select MIN(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });
    dateTimeMax = await db.sequelize.query(`select MAX(${datetimeColumn}) from ${collectionId}`, { type: QueryTypes.SELECT });

    const dates0 = await genDates4Interval(dateTimeMin, dateTimeMax);

    intervalArray = [dates0];
    
    const links = await links4collections('gtgb', context);
    //let supportedCRS: Array<string> = [];
    /*
        async function genCRSArray() {
            if (listAllCRS == true) {
                return supportedCRS;
            } else {
                return [
                    '#/crs',
                    storageCRS]
            }
        }
        //genCRSArray();
        //const crs = await genCRSArray(); //Supported CRS
        */
    const metadata = {
        id: collectionId,
        title: `Collection ${collectionId}`,
        description: `Collection ${collectionId} description`,
        extent: {
            spatial: {
                bbox: extent,
                crs: storageCRS //CRS84
            },
            termporal: {
                interval: intervalArray,
                trs: trs
            }
        },
        itemType: "feature",
        crs: listAllCRS == true ? supportedCRS : ['#/crs', storageCRS],
        storageCrs: storageCRS, //CRS84
        storageCrsCoordinateEpoch: storageCrsCoordinateEpoch,
        links: links
    }
    return metadata;
}