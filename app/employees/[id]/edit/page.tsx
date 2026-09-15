import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getEmployee } from "@/lib/api/employee"
import { auth } from "@/lib/auth"
import { EditEmployeeForm } from "./form"

export const metadata: Metadata = {
    title: "Edit Karyawan",
    description: "Edit data karyawan",
}

interface EditEmployeePageProps {
    params: Promise<{ id: string }>
}

export default async function EditEmployeePage({
    params,
}: EditEmployeePageProps): Promise<React.ReactElement> {
    const { id } = await params
    const employeeID = Number(id)
    if (!Number.isInteger(employeeID) || employeeID <= 0) {
        notFound()
    }

    const session = await auth()
    const employee = await getEmployee(employeeID, session)

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">
                    Edit Karyawan
                </h2>
                <p className="text-muted-foreground">
                    Ubah data karyawan dan gaji per shift mereka.
                </p>
            </div>
            <div className="max-w-2xl">
                <EditEmployeeForm employee={employee} />
            </div>
        </main>
    )
}
