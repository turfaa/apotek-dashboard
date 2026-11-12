"use client"

import { DataTableColumnDef } from "@/lib/data-table"
import { WorkType } from "@/lib/api/work"

export const columns: DataTableColumnDef<WorkType>[] = [
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "outcomeUnit",
        header: "Satuan Hasil",
    },
    {
        accessorKey: "multiplier",
        header: "Pengali Gaji",
        cell: ({ row }) => {
            const multiplier = row.getValue("multiplier") as number
            return `${multiplier}x`
        },
    },
    {
        accessorKey: "notes",
        header: "Catatan",
    },
]
