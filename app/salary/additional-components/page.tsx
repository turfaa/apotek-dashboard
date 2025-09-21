import { auth } from "@/lib/auth"
import { getEmployees } from "@/lib/api/employee"
import { AdditionalComponentsPageClient } from "./additional-components-page-client"
import { Title, Subtitle } from "@/components/typography"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Komponen Gaji Tambahan",
    description: "Kelola komponen gaji tambahan untuk setiap karyawan per bulan.",
}

interface AdditionalComponentsPageProps {
    searchParams: Promise<{
        employeeID?: string
        month?: string
    }>
}

export default async function AdditionalComponentsPage({
    searchParams,
}: AdditionalComponentsPageProps): Promise<React.ReactElement> {
    const sessionPromise = auth()

    // Get default month (previous month)
    const defaultMonth = new Date()
    defaultMonth.setMonth(defaultMonth.getMonth() - 1)
    const defaultMonthString = defaultMonth.toISOString().slice(0, 7) // YYYY-MM format

    // Process search params
    const processedSearchParams = searchParams.then((params) => ({
        employeeID: params.employeeID,
        month: params.month || defaultMonthString,
    }))

    // Fetch employees
    const employeesPromise = sessionPromise.then((session) =>
        getEmployees(session),
    )

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <Title>Komponen Gaji Tambahan</Title>
                <Subtitle>
                    Kelola komponen gaji tambahan untuk setiap karyawan per bulan.
                </Subtitle>
            </div>

            <AdditionalComponentsPageClient
                employeesPromise={employeesPromise}
                sessionPromise={sessionPromise}
                searchParamsPromise={processedSearchParams}
            />
        </main>
    )
}
