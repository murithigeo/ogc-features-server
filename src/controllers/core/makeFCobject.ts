
export async function createFCobject(numberMatched: number, //minus offset
     numberReturned: number,featuresArray:Array<any>,links:Array<any>) {
    const featurecollection = {
        type: 'FeatureCollection',
        numberMatched: numberMatched,
        numberReturned: numberReturned,
        timeStamp: new Date().toJSON(),
        features: featuresArray,
        links: links
    };
    return featurecollection;
}