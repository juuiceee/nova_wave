export type Pagination<I extends Iterable<any>> = Readonly<{
    count: number;
    rows: I;
}>;