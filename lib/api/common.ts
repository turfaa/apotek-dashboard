export function buildDateRangeQueryParams(
    from?: string,
    until?: string,
): string {
    if (!from) {
        return ""
    }

    return until ? `from=${from}&until=${until}` : `from=${from}`
}
