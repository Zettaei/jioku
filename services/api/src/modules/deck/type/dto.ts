export interface PaginatedResponse<T> {
    result: Array<T>;
    pagination: {
        page: number,
        limit: number,
        hasNext: boolean
    }
}
