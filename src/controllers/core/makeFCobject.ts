
export async function createFCobject(numberMatched: number, numberReturned: number,featuresArray:Array<any>,links:Array<any>) {
    const featurecollection = {
        type: 'FeatureCollection',
        numberMatched: numberMatched,
        numberReturned: numberReturned,
        features: featuresArray,
        links: links
    };
    return featurecollection;
}