import { auth } from "@/lib/auth"
import { getEmployees } from "@/lib/api/employee"
import { getSalarySnapshots } from "@/lib/api/salary"
import { SnapshotDetailClient } from "./snapshot-detail-client"
import { Title, Subtitle } from "@/components/typography"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
    title: "Detail Snapshot Gaji",
    description: "Lihat detail snapshot gaji karyawan.",
}

interface SnapshotDetailPageProps {
    params: Promise<{
        id: string
    }>
    searchParams: Promise<{
        print?: string
    }>
}

export default async function SnapshotDetailPage({
    params,
    searchParams,
}: SnapshotDetailPageProps): Promise<React.ReactElement> {
    const sessionPromise = auth()
    const { id } = await params
    const { print } = await searchParams
    const isPrintMode = print === "true"

    const session = await sessionPromise
    if (!session) {
        notFound()
    }

    // Fetch snapshot by ID
    const snapshots = await getSalarySnapshots({}, session)
    const snapshot = snapshots.find(s => s.id === parseInt(id))
    
    if (!snapshot) {
        notFound()
    }

    // Fetch employees
    const employeesPromise = getEmployees(session)

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            {!isPrintMode && (
                <div className="mb-6">
                    <Title>Detail Snapshot Gaji</Title>
                    <Subtitle>
                        Lihat detail snapshot gaji karyawan.
                    </Subtitle>
                </div>
            )}

            <SnapshotDetailClient
                snapshot={snapshot}
                employeesPromise={employeesPromise}
                sessionPromise={sessionPromise}
            />
        </main>
    )
}
