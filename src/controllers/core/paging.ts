// Function to calculate paging offsets
export  async function calcPaging(count: number, limit: number, offset: number) {

    const maxOffset = Math.max(count - limit, 0);

    // Calculate the next page offset
    //const nextPageOffset = Math.min(offset + limit, maxOffset);

    const nextPageOffset = offset + limit;
    
    // Calculate the previous page offset
    const prevPageOffset = offset > 0 || offset === 0 ? null : Math.max(offset - limit, 0);

    return {
        maxOffset,
        nextPageOffset,
        prevPageOffset
    };
}