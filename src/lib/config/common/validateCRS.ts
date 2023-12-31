import  CRSnProps  from "./CRSnProperties";

export default async function verify_CRS(crs: string) {
    const crsArray:Array<any> = CRSnProps.filter(obj => obj.crs === crs);
    return crsArray;
}