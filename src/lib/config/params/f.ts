let resContentTypes = {
    self$f: undefined,
    self$CT: undefined,
    alt$f: undefined,
    alt$CT: undefined,
};

export async function initF$GeoJSON(context: any) {

    context.params.query.f === (undefined || `json`) ? resContentTypes = {
        self$f: `json`,
        self$CT: `application/geo+json`,
        alt$f: `html`,
        alt$CT: `text/html`,
    } : resContentTypes = {
        self$f: `html`,
        self$CT: `text/html`,
        alt$f: `json`,
        alt$CT: `application/geo+json`,
    };
    return resContentTypes;
}

export async function initF$JSON(context: any) {
    context.params.query.f === (undefined || `json`) ? resContentTypes = {
        self$f: `json`,
        self$CT: `application/json`,
        alt$f: `html`,
        alt$CT: `text/html`,
    } : resContentTypes = {
        self$f: `html`,
        self$CT: `text/html`,
        alt$f: `json`,
        alt$CT: `application/json`,
    };
    return resContentTypes;
}