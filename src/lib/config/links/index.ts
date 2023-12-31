import init4collections from "./collections";
import init4conformance from "./conformance";
import init4feature from "./feature";
import init4featurecoll from "./featurecollection";
import init4landingpage from "./landingpage";
import init4maincollection from "./mainCollection";

export async function links4collections(collectionId: string, context: any) {
    const links = await init4collections(collectionId, context)
    return links;
}

export async function links4conformance(context: any) {
    const links = await init4conformance(context);
    return links;
}

export async function links4feature(collectionId: string, featureId: string, context: any) {
    const links = await init4feature(collectionId, featureId, context);
    return links;
}

export async function links4featureCollection(collectionId: string, context: any, offset: number, count: number, prevPageOffset: number, nextPageOffset: number) {
    const links = await init4featurecoll(collectionId, context, offset, count - offset, prevPageOffset, nextPageOffset);
    return links;
}

export async function links4landingPage(context:any){
    const links=await init4landingpage(context);
    return links;
}

export async function links4MainColl(context:any){
    const links= await init4maincollection(context);
    return links;
}