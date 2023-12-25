
export async function createFeatureCollection(numberMatched: number, //minus offset
     numberReturned: number,featuresArray:Array<object>,links:Array<object>) {
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