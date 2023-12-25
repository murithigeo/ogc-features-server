import { supportedCRS } from './coreVars';
/**
 * 
 * @param crs Parses the CRS string from the {crs}/{bbox-crs} to get {authority_name}+{srid} code which must match
 * @returns rows which can only have 2>length>0. If empty, then not valid CRS
 */
export async function verify_use_CRS(crs: string) {
    //console.log(crs);

    /**
     * @description is an array containing the CRS that will be used in the project
     * @crs is the CRS that is requested by the client. Default is <${storageCRS[0]}>
     * @srid is the SRID of the CRS. The default @crs will default to 4326 with the notable exception that its axis order is x,y
     * @postgis stores geographic coordinates in the order x,y although 4326 is y,x. This necessitates flipping of coordinates if crs=4326
     */
    const CRSnProps = [
        {
            crs: supportedCRS[2], //EPSG:3395
            srid: 3395,
            auth_name: 'EPSG',
            isGeographic: false,
        },
        {
            crs: supportedCRS[3], //EPSG:3857
            srid: 3857,
            auth_name: 'EPSG',
            isGeographic: false,
        },
        {
            crs: supportedCRS[1], //EPSG:4326
            srid: 4326,
            auth_name: 'EPSG',
            isGeographic: true,
        },
        {
            crs: supportedCRS[0], //OGC:CRS84
            srid: 4326,
            auth_name: 'OGC',
            isGeographic: false,
        }
    ];
    //const useCrs = knownCRS.find(item => item.crs === crs);
    const crsArray = CRSnProps.filter(obj => obj.crs === crs);
    //console.log(crsArray);
    return crsArray;
}