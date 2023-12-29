let datetimeVals = {
    startDate: undefined,
    endDate: undefined,
    date: undefined
};

export default async function initDateTime(context: any) {

    // Decode the URL-encoded datetime string
    const decodedDatetime = decodeURIComponent(context.params.query.datetime);

    const matchInterval = decodedDatetime.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/);
    const matchHalfBoundedStart = decodedDatetime.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\/../);
    const matchHalfBoundedEnd = decodedDatetime.match(/..\/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/);

    if (matchInterval) {
        // interval-bounded
        datetimeVals.startDate = matchInterval[1];
        datetimeVals.endDate = matchInterval[2];
    } else if (matchHalfBoundedStart) {
        // interval-half-bounded-start
        datetimeVals.startDate = matchHalfBoundedStart[1];
    } else if (matchHalfBoundedEnd) {
        // interval-half-bounded-end
        datetimeVals.endDate = matchHalfBoundedEnd[1];
    } else {
        // single date
        datetimeVals.date = decodedDatetime;
    }

    //console.log(datetimeVals)
    return datetimeVals;
}