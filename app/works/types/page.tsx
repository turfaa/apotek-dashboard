import { Metadata } from "next"
import { getWorkTypes } from "@/lib/api/work"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { Subtitle, Title } from "@/components/typography/v2"

export const metadata: Metadata = {
    title: "Jenis Pekerjaan",
    description: "Kelola jenis pekerjaan dan pengali gaji",
}

export default function WorkTypesPage(): React.ReactElement {
    const workTypesPromise = auth().then((session) => getWorkTypes(session))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title>Jenis Pekerjaan</Title>
                    <Subtitle>
                        Kelola jenis pekerjaan dan pengali gaji di sini.
                    </Subtitle>
                </div>
                <Link href="/works/types/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Jenis Pekerjaan
                    </Button>
                </Link>
            </div>
            <DataTable columns={columns} dataPromise={workTypesPromise} />
        </main>
    )
}
