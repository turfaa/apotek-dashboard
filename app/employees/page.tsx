import { Metadata } from "next"
import { getEmployees } from "@/lib/api/employee"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
    title: "Karyawan",
    description: "Kelola karyawan dan gaji per shift mereka",
}

export default function EmployeesPage(): React.ReactElement {
    const employees = auth().
        then(session => getEmployees(session))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Karyawan</h2>
                    <p className="text-muted-foreground">
                        Kelola karyawan dan gaji per shift mereka di sini.
                    </p>
                </div>
                <Link href="/employees/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Karyawan
                    </Button>
                </Link>
            </div>
            <DataTable columns={columns} dataPromise={employees} />
        </main>
    )
} 