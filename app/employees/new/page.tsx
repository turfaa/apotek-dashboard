import { Metadata } from "next"
import { EmployeeForm } from "./form"

export const metadata: Metadata = {
    title: "Tambah Karyawan",
    description: "Tambah karyawan baru ke sistem",
}

export default function NewEmployeePage() {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Tambah Karyawan</h2>
                <p className="text-muted-foreground">
                    Buat karyawan baru dan atur gaji per shift mereka.
                </p>
            </div>
            <div className="max-w-2xl">
                <EmployeeForm />
            </div>
        </main>
    )
} 