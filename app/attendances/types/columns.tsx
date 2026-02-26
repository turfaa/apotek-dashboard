"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AttendanceType, PayableType } from "@/lib/api/attendance"
import { Badge } from "@/components/ui/badge"
import { EnableQuotaButton } from "./enable-quota-button"

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
    {
        accessorKey: "hasQuota",
        header: "Kuota",
        cell: ({ row }) => {
            const hasQuota = row.getValue("hasQuota") as boolean
            if (hasQuota) {
                return <Badge>Aktif</Badge>
            }
            return <Badge variant="secondary">Tidak Aktif</Badge>
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const attendanceType = row.original
            if (attendanceType.hasQuota) {
                return null
            }
            return <EnableQuotaButton attendanceType={attendanceType} />
        },
    },
]
