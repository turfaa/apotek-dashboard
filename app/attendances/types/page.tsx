import { Metadata } from "next"
import { getAttendanceTypes } from "@/lib/api/attendance"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { Subtitle, Title } from "@/components/typography/v2"

export const metadata: Metadata = {
    title: "Jenis Kehadiran",
    description: "Kelola jenis kehadiran dan tipe pembayaran",
}

export default function AttendanceTypesPage(): React.ReactElement {
    const attendanceTypesPromise = auth().then(session => getAttendanceTypes(session))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title>Jenis Kehadiran</Title>
                    <Subtitle>Kelola jenis kehadiran dan tipe pembayaran di sini.</Subtitle>
                </div>
                <Link href="/attendances/types/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Jenis Kehadiran
                    </Button>
                </Link>
            </div>
            <DataTable columns={columns} dataPromise={attendanceTypesPromise} />
        </main>
    )
}
