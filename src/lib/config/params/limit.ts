export default async function initLimit(context: any) {
    const limit: number = context.params.query.limit; //contigent on the limit parameter having a default
    return limit
}