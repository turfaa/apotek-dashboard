"use client"

import { ChangeEvent, use, useTransition } from "react"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import Loading from "@/components/loading"
import { DateRangePicker } from "@/components/date-range-picker/date-range-picker"
import {
    SupplierCombobox,
    SupplierOption,
} from "@/components/purchase-order-letter/supplier-combobox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
    PurchaseOrderLetterEmployee,
    PurchaseOrderLetterOptions,
} from "@/lib/api/purchase-order-letter"
import { useResetCount, useResetFilters } from "./reset-filters"
import { filterKeys } from "./search-params"

const all = "ALL"

export interface HistoryFiltersProps {
    suppliersPromise: Promise<SupplierOption[]>
    optionsPromise: Promise<PurchaseOrderLetterOptions | null>
    creatorsPromise: Promise<PurchaseOrderLetterEmployee[]>
}

// The Riwayat filter bar. Every filter lives in the URL, so a filtered view
// survives a reload and can be shared; changing one goes back to page 1.
export function HistoryFilters({
    suppliersPromise,
    optionsPromise,
    creatorsPromise,
}: HistoryFiltersProps): React.ReactElement {
    const suppliers = use(suppliersPromise)
    const templates = use(optionsPromise)?.templates ?? []
    const creators = use(creatorsPromise)

    const [isPending, startTransition] = useTransition()
    const [resetFilters, isResetting] = useResetFilters()
    const resetCount = useResetCount()
    const [filters, setFilters] = useQueryStates(
        {
            query: parseAsString,
            supplier: parseAsInteger,
            template: parseAsString,
            creator: parseAsInteger,
            page: parseAsInteger,
        },
        {
            urlKeys: filterKeys,
            shallow: false,
            startTransition,
        },
    )

    const setFilter = (update: Partial<Omit<typeof filters, "page">>) =>
        setFilters({ ...update, page: null })

    return (
        <div
            key={resetCount}
            className="mb-4 flex flex-wrap items-end gap-3"
        >
            <div className="flex min-w-[220px] flex-[1_1_260px] flex-col gap-1.5">
                <Label htmlFor="sp-search">Cari</Label>
                <Input
                    id="sp-search"
                    placeholder="Nomor SP atau nama obat…"
                    defaultValue={filters.query ?? ""}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setFilters(
                            {
                                query: event.target.value.trim() || null,
                                page: null,
                            },
                            { throttleMs: 500 },
                        )
                    }
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>Tanggal</Label>
                <DateRangePicker defaultDateRangeType="Bulan ini" />
            </div>

            <div className="flex w-full flex-col gap-1.5 sm:w-[220px]">
                <Label htmlFor="sp-supplier">Supplier</Label>
                <SupplierCombobox
                    id="sp-supplier"
                    suppliers={suppliers}
                    value={filters.supplier}
                    onChange={(supplier) => setFilter({ supplier })}
                    allLabel="Semua supplier"
                />
            </div>

            <div className="flex w-full flex-col gap-1.5 sm:w-[200px]">
                <Label htmlFor="sp-template">Template</Label>
                <Select
                    value={filters.template ?? all}
                    onValueChange={(value) =>
                        setFilter({ template: value === all ? null : value })
                    }
                >
                    <SelectTrigger id="sp-template">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={all}>Semua template</SelectItem>
                        {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                                {template.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex w-full flex-col gap-1.5 sm:w-[180px]">
                <Label htmlFor="sp-creator">Dibuat oleh</Label>
                <Select
                    value={filters.creator ? String(filters.creator) : all}
                    onValueChange={(value) =>
                        setFilter({ creator: value === all ? null : Number(value) })
                    }
                >
                    <SelectTrigger id="sp-creator">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={all}>Semua</SelectItem>
                        {creators.map((creator) => (
                            <SelectItem key={creator.id} value={String(creator.id)}>
                                {creator.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    onClick={resetFilters}
                >
                    Reset filter
                </Button>
                {(isPending || isResetting) && <Loading />}
            </div>
        </div>
    )
}

export function HistoryFiltersFallback(): React.ReactElement {
    return (
        <div className="mb-4 flex flex-wrap items-end gap-3">
            <Skeleton className="h-9 flex-[1_1_260px]" />
            <Skeleton className="h-9 w-[300px]" />
            <Skeleton className="h-9 w-[220px]" />
            <Skeleton className="h-9 w-[200px]" />
            <Skeleton className="h-9 w-[180px]" />
        </div>
    )
}
