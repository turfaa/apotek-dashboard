// The first and last day of the current month as YYYY-MM-DD, in the local
// time zone.
export function currentMonthRange(): { from: string; until: string } {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return {
        from: firstDay.toLocaleDateString("en-CA"),
        until: lastDay.toLocaleDateString("en-CA"),
    }
}
