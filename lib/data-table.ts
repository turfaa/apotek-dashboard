import {
    columnVisibilityFeature,
    ColumnDef,
    createPaginatedRowModel,
    rowPaginationFeature,
    RowData,
    rowSelectionFeature,
    tableFeatures,
} from "@tanstack/react-table"

// Features shared by the paginated data tables (employees, work types, attendance types).
export const dataTableFeatures = tableFeatures({
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    paginatedRowModel: createPaginatedRowModel(),
})

export type DataTableFeatures = typeof dataTableFeatures

export type DataTableColumnDef<TData extends RowData, TValue = any> = ColumnDef<
    DataTableFeatures,
    TData,
    TValue
>
