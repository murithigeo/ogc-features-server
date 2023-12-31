import { supportedCRS } from "../common/coreVariables";

export default async function initContentCrs(context: any) {
    const contentCrs:string = context.params.query.crs === undefined ? `<${supportedCRS[0]}` : `<${context.params.query.crs}>`
    return contentCrs
}