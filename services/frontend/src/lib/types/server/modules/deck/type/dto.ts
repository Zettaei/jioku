export interface PaginatedResponse<T> {
    result: Array<T>;
    pagination: {
        page: number,
        limit: number,
        hasNext: boolean
    }
}

export interface PaginatedResponseWithTotalCount<T> {
    result: Array<T>;
    total: number;
    pagination: {
        page: number,
        limit: number,
    }
}