import * as queryString from "querystring";

export async function validateQueryParams(context:any) {
    //console.log(`queryParams: ${context.params.query}`)
    //console.log(`parsedParaams: ${context.req._parsedUrl.query}`)
    const allowedParams = [];
    if (Object.keys(context.params.query).length > 0) {
        allowedParams.push(...Object.keys(context.params.query));
    }
    const queryParams = queryString.parse(context.req._parsedUrl.query);
    const unexpectedParams = Object.keys(queryParams).filter(param => !allowedParams.includes(param));
    return unexpectedParams;
}