import { auth } from "@/lib/auth"
import { getEmployees } from "@/lib/api/employee"
import { getSalarySnapshot } from "@/lib/api/salary"
import { SnapshotDetailClient } from "./snapshot-detail-client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Detail Snapshot Gaji",
    description: "Lihat detail snapshot gaji karyawan.",
}

interface SnapshotDetailPageProps {
    params: Promise<{
        id: string
    }>
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
