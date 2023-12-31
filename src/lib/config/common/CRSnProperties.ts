const CRSnProps = [
    {
        crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84", //OGC:CRS84
        srid: 4326,
        auth_name: 'OGC',
        isGeographic: false,
    },
    {
        crs: "http://www.opengis.net/def/crs/EPSG/0/4326", //EPSG:4326
        srid: 4326,
        auth_name: 'EPSG',
        isGeographic: true,
    },
    {
        crs: "http://www.opengis.net/def/crs/EPSG/0/3395", //EPSG:3395
        srid: 3395,
        auth_name: 'EPSG',
        isGeographic: false,
    },
    {
        crs: "http://www.opengis.net/def/crs/EPSG/0/3857", //EPSG:3857
        srid: 3857,
        auth_name: 'EPSG',
        isGeographic: false,
    },

];

export default CRSnProps;