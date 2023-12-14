export const storageCRS: Array<string> = [
    "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
    "http://www.opengis.net/def/crs/EPSG/0/4326"
]; //CRS84. Is the default Storage CRS Unless Otherwise Specified

//CRS84. Is the default CRS Used for processing unless otherwise specified in the request
//export const defaultCRS: string = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";

//Default temporal reference system.
export const trs: string = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";

//PostGIS version
//const PostGISVersion = db.sequelize.query("SELECT PostGIS_Version();", { type: QueryTypes.SELECT })["postgis_version"];

//In the future, allow user to specify the CRS and date of data collection
const PG34rdate: string = "2023-08-23";
const rdate = new Date(PG34rdate);

export const storageCrsCoordinateEpoch: number = parseFloat((rdate.getFullYear() + ((rdate.getMonth() + 1) - 1) / 12 + (rdate.getDate() - 1) / 365.25).toFixed(2))