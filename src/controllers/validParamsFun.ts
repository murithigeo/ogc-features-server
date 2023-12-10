import * as queryString from "querystring";

export async function validateParams(obj) {
    const allowedParams = [];
    if (Object.keys(obj.params.query).length > 0) {
        allowedParams.push(...Object.keys(obj.params.query));
    }
    const queryParams = queryString.parse(obj.req._parsedUrl.query);
    const unexpectedParams = Object.keys(queryParams).filter(param => !allowedParams.includes(param));
    return unexpectedParams;
}