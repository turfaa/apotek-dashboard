export function buildDateRangeQueryParams(from?: string, to?: string): string {
    if (!from) {
        return ""
    }

    return to ? `from=${from}&to=${to}` : `from=${from}`
}

export function buildQueryParams(params: Record<string, any>): string {
    return Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
}