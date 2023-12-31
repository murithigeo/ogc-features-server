import  CRSnProps  from "./CRSnProperties";
//Supported CRS which should appear in the crs key of the /collections request
export const supportedCRS: Array<string> = CRSnProps.map(obj => obj.crs);

export const storageCRS: string = supportedCRS[0];

//Default temporal reference system.
export const trs: string = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";

//In the future, allow user to specify the CRS and date of data collection
const PG34rdate: string = "2023-08-23";
const rdate = new Date(PG34rdate);

export const storageCrsCoordinateEpoch: number = parseFloat((rdate.getFullYear() + ((rdate.getMonth() + 1) - 1) / 12 + (rdate.getDate() - 1) / 365.25).toFixed(2));
