import { auth } from "@/lib/auth"
import { getEmployees } from "@/lib/api/employee"
import { getSalarySnapshot } from "@/lib/api/salary"
import { SnapshotDetailClient } from "./snapshot-detail-client"
import { Metadata } from "next"

interface SnapshotDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: SnapshotDetailPageProps): Promise<Metadata> {
    const session = await auth()
    const { id } = await params

    try {
        const [snapshot, employees] = await Promise.all([
            getSalarySnapshot(parseInt(id), session),
            getEmployees(session),
        ])
        const employee = employees.find((emp) => emp.id === snapshot.employeeID)
        const title = `${snapshot.month} - ${employee?.name ?? "Detail Snapshot Gaji"}`
        return { title, description: "Lihat detail snapshot gaji karyawan." }
    } catch {
        return {
            title: "Detail Snapshot Gaji",
            description: "Lihat detail snapshot gaji karyawan.",
        }
    }
}

export default async function SnapshotDetailPage({
    params,
}: SnapshotDetailPageProps): Promise<React.ReactElement> {
    const sessionPromise = auth()
    const { id } = await params

    // Fetch snapshot by ID
    const snapshotPromise = sessionPromise.then((session) => getSalarySnapshot(parseInt(id), session))

    // Fetch employees
    const employeesPromise = sessionPromise.then((session) => getEmployees(session))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl"> 
            <SnapshotDetailClient
                snapshotPromise={snapshotPromise}
                employeesPromise={employeesPromise}
                sessionPromise={sessionPromise}
            />
        </main>
    )
}
