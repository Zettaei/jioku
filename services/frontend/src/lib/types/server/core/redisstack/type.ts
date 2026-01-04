
export interface FtSearchResult<T> {
    total: number;
    documents: Array<{
        id: string;
        value: T;
    }>
}