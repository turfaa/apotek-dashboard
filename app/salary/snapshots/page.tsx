import { auth } from "@/lib/auth"
import { getEmployees } from "@/lib/api/employee"
import { SnapshotsPageClient } from "./snapshots-page-client"
import { Title, Subtitle } from "@/components/typography"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Snapshot Gaji",
    description: "Lihat dan kelola snapshot gaji karyawan.",
}

interface SnapshotsPageProps {
    searchParams: Promise<{
        employeeID?: string
        month?: string
    }>
}

export default async function SnapshotsPage({
    searchParams,
}: SnapshotsPageProps): Promise<React.ReactElement> {
    const sessionPromise = auth()

    // Process search params
    const processedSearchParams = searchParams.then((params) => ({
        employeeID: params.employeeID,
        month: params.month,
    }))

    // Fetch employees
    const employeesPromise = sessionPromise.then((session) =>
        getEmployees(session),
    )

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <Title>Snapshot Gaji</Title>
                <Subtitle>
                    Lihat dan kelola snapshot gaji karyawan.
                </Subtitle>
            </div>

            <SnapshotsPageClient
                employeesPromise={employeesPromise}
                sessionPromise={sessionPromise}
                searchParamsPromise={processedSearchParams}
            />
        </main>
    )
}
