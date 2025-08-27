"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AttendanceType, PayableType } from "@/lib/api/attendance"

export const columns: ColumnDef<AttendanceType>[] = [
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "payableType",
        header: "Tipe Pembayaran",
        cell: ({ row }) => {
            const payableType = row.getValue("payableType") as PayableType
            const typeLabels = {
                [PayableType.Working]: "Kerja",
                [PayableType.Benefit]: "Tunjangan",
                [PayableType.None]: "Tidak Ada",
            }
            return typeLabels[payableType] || payableType
        },
    },
]
