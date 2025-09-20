import { Metadata } from "next"
import { AttendanceTypeForm } from "./form"
import { auth } from "@/lib/auth"
import { use } from "react"

export const metadata: Metadata = {
    title: "Tambah Jenis Kehadiran",
    description: "Tambah jenis kehadiran baru ke sistem",
}

export default function NewAttendanceTypePage() {
    const session = use(auth())

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">
                    Tambah Jenis Kehadiran
                </h2>
                <p className="text-muted-foreground">
                    Buat jenis kehadiran baru dan atur tipe pembayarannya.
                </p>
            </div>
            <div className="max-w-2xl">
                <AttendanceTypeForm session={session} />
            </div>
        </main>
    )
}
