import { auth } from "@/lib/auth"
import { getEmployees } from "@/lib/api/employee"
import { StaticComponentsPageClient } from "./static-components-page-client"
import { Title, Subtitle } from "@/components/typography"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Komponen Gaji Statis",
    description: "Kelola komponen gaji statis untuk setiap karyawan.",
}

interface StaticComponentsPageProps {
    searchParams: Promise<{
        employeeID?: string
    }>
}

export default async function StaticComponentsPage({
    searchParams,
}: StaticComponentsPageProps): Promise<React.ReactElement> {
    const sessionPromise = auth()

    // Process search params
    const processedSearchParams = searchParams.then((params) => ({
        employeeID: params.employeeID,
    }))

    // Fetch employees
    const employeesPromise = sessionPromise.then((session) =>
        getEmployees(session),
    )

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <Title>Komponen Gaji Statis</Title>
                <Subtitle>
                    Kelola komponen gaji statis untuk setiap karyawan.
                </Subtitle>
            </div>

            <StaticComponentsPageClient
                employeesPromise={employeesPromise}
                sessionPromise={sessionPromise}
                searchParamsPromise={processedSearchParams}
            />
        </main>
    )
}
