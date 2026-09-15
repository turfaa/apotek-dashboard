"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Employee } from "@/lib/api/employee"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"

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
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
            <Link href={`/employees/${row.original.id}/edit`}>
                <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </Link>
        ),
    },
]
