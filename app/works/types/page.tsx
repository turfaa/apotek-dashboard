import { Metadata } from "next"
import { getWorkTypes } from "@/lib/api/work"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
    title: "Jenis Pekerjaan",
    description: "Kelola jenis pekerjaan dan pengali gaji",
}

export default function WorkTypesPage(): React.ReactElement {
    const workTypes = auth().
        then(session => getWorkTypes(session))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Jenis Pekerjaan</h2>
                    <p className="text-muted-foreground">
                        Kelola jenis pekerjaan dan pengali gaji di sini.
                    </p>
                </div>
                <Link href="/works/types/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Jenis Pekerjaan
                    </Button>
                </Link>
            </div>
            <DataTable columns={columns} dataPromise={workTypes} />
        </main>
    )
} 