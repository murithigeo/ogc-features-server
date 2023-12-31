
export default async function initOffset(context: any) {
    const offset: number = context.params.query.offset === undefined || context.params.query.offset < 0 ? 0 : context.params.query.offset;
    return offset;
}