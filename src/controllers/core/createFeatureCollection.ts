
export async function createFeatureCollection( //minus offset
     numberReturned: number,
     featuresArray:Array<object>,
     links:Array<object>,
     count:number) {
    const featurecollection = {
        type: 'FeatureCollection',
        numberMatched: featuresArray.length,
        numberReturned: numberReturned,
        timeStamp: new Date().toJSON(),
        features: featuresArray,
        links: links,
        totalMatch:count
    };
    return featurecollection;
}