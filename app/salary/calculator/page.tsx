import { auth } from "@/lib/auth"
import { getEmployees } from "@/lib/api/employee"
import { SalaryPageClient } from "./salary-page-client"
import { Title, Subtitle } from "@/components/typography"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Kalkulator Gaji",
    description: "Kalkulator gaji karyawan",
}

interface SalaryCalculatorPageProps {
    searchParams: Promise<{
        month?: string
        employeeID?: string
    }>
}

export default async function SalaryCalculatorPage({
    searchParams,
}: SalaryCalculatorPageProps): Promise<React.ReactElement> {
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
                <Title>Kalkulator Gaji</Title>
                <Subtitle>
                    Hitung gaji bulanan karyawan di sini.
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
