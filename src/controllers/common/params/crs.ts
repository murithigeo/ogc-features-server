import { supportedCRS } from "../core/global.variables"


export default async function initCrs(context: any) {
    const crs: string = context.params.query.crs === undefined ? supportedCRS[0] : context.params.query.crs;
    return crs
}