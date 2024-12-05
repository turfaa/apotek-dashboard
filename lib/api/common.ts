export function buildDateRangeQueryParams(
    from?: string,
    to?: string,
): string {
    if (!from) {
        return ""
    }

    return to ? `from=${from}&to=${to}` : `from=${from}`
}
