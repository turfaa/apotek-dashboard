import { Metadata } from "next"
import { WorkTypeForm } from "./form"
import { auth } from "@/lib/auth"
import { use } from "react"

export const metadata: Metadata = {
    title: "Tambah Jenis Pekerjaan",
    description: "Tambah jenis pekerjaan baru ke sistem",
}

export default function NewWorkTypePage() {
    const session = use(auth())

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">
                    Tambah Jenis Pekerjaan
                </h2>
                <p className="text-muted-foreground">
                    Buat jenis pekerjaan baru dan atur pengali gajinya.
                </p>
            </div>
            <div className="max-w-2xl">
                <WorkTypeForm session={session} />
            </div>
        </main>
    )
}
