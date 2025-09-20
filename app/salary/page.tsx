import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { getEmployees } from "@/lib/api/employee"
import { Title, Subtitle } from "@/components/typography/v2"
import { SalaryPageClient } from "./salary-page-client"

export const metadata: Metadata = {
    title: "Gaji",
    description: "Lihat detail gaji karyawan per bulan",
}

interface SalaryPageProps {
    searchParams: Promise<{
        month?: string
        employeeID?: string
    }>
}

export default async function SalaryPage({
    searchParams,
}: SalaryPageProps): Promise<React.ReactElement> {
    const sessionPromise = auth()

    // Get default month (previous month)
    const defaultMonth = new Date()
    defaultMonth.setMonth(defaultMonth.getMonth() - 1)
    const defaultMonthString = defaultMonth.toISOString().slice(0, 7) // YYYY-MM format

    // Process search params
    const processedSearchParams = searchParams.then((params) => ({
        month: params.month || defaultMonthString,
        employeeID: params.employeeID,
    }))

    // Fetch employees
    const employeesPromise = sessionPromise.then((session) =>
        getEmployees(session),
    )

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <Title>Gaji</Title>
                <Subtitle>
                    Lihat detail gaji karyawan per bulan di sini.
                </Subtitle>
            </div>

            <SalaryPageClient
                employeesPromise={employeesPromise}
                sessionPromise={sessionPromise}
                searchParamsPromise={processedSearchParams}
            />
        </main>
    )
}
