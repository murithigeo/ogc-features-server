export default async function initPaging(
    count: number, //the number of records matching the query
    offset: number, //the current offset
    limit: number,//the current limit
) {
    let numberReturned: number;
    const startIndex = Math.min(offset, count);
    const endIndex = Math.min(startIndex + limit, count);
    numberReturned += endIndex - startIndex;
    const nextPageOffset: number = offset + limit;
    const prevPageOffset: number = offset - limit;
    return { numberReturned, nextPageOffset, prevPageOffset };
}