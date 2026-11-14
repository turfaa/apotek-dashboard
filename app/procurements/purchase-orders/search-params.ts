import { PurchaseOrderLetterFilters } from "@/lib/api/purchase-order-letter"
import { currentMonthRange } from "@/lib/date-range"

// URL query of the Riwayat page. `from` and `until` are the keys the shared
// DateRangePicker writes.
export const filterKeys = {
    query: "q",
    from: "from",
    until: "until",
    supplier: "supplier",
    template: "template",
    creator: "creator",
    page: "page",
} as const

export const pageSize = 20

function positiveInt(value: string | undefined): number | undefined {
    const n = Number(value)
    return Number.isInteger(n) && n > 0 ? n : undefined
}

export function filtersFromSearchParams(params: {
    [key: string]: string | undefined
}): PurchaseOrderLetterFilters {
    let from = params[filterKeys.from]
    let until = params[filterKeys.until]
    if (!from && !until) {
        ;({ from, until } = currentMonthRange())
    }

    return {
        q: params[filterKeys.query]?.trim() || undefined,
        from,
        to: until,
        supplierVmedisId: positiveInt(params[filterKeys.supplier]),
        templateId: params[filterKeys.template] || undefined,
        createdByEmployeeId: positiveInt(params[filterKeys.creator]),
        page: positiveInt(params[filterKeys.page]) ?? 1,
        pageSize,
    }
}

const dateTimeFormat = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
})

// Formats an SP's creation time in Asia/Jakarta, the same on the server and
// in the browser.
export function formatCreatedAt(iso: string): string {
    return dateTimeFormat.format(new Date(iso))
}
