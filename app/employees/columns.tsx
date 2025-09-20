"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Employee } from "@/lib/api/employee"

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "shiftFee",
        header: "Gaji per Shift",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("shiftFee"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(amount)
            return formatted
        },
    },
    {
        accessorKey: "createdAt",
        header: "Dibuat Pada",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Diperbarui Pada",
        cell: ({ row }) => {
            const date = new Date(row.getValue("updatedAt"))
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
        },
    },
]
