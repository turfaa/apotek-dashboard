import { Metadata } from "next"
import { getAttendanceTypes } from "@/lib/api/attendance"
import { getEmployees } from "@/lib/api/employee"
import { auth } from "@/lib/auth"
import { Title, Subtitle } from "@/components/typography/v2"
import { AttendanceTable } from "./index"
import MonthPicker from "@/components/month-picker"
import { use } from "react"

export const metadata: Metadata = {
    title: "Kehadiran",
    description: "Kelola kehadiran karyawan",
}

export default function AttendancesPage(): React.ReactElement {
    const sessionPromise = auth()
    const employeesPromise = sessionPromise.then(session => getEmployees(session))
    const attendanceTypesPromise = sessionPromise.then(session => getAttendanceTypes(session))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <Title>Kehadiran</Title>
                <Subtitle>Kelola kehadiran karyawan di sini.</Subtitle>
            </div>
            
            <div className="mb-6">
                <MonthPicker />
            </div>
            
            <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Petunjuk Penggunaan:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Klik pada sel yang dapat diedit (bulan ini, bulan lalu, atau bulan depan) untuk mengubah kehadiran</li>
                    <li>• Sel yang tidak dapat diedit akan terlihat redup dan tidak dapat diklik</li>
                    <li>• Baris total di bawah menunjukkan jumlah hari kerja dan total jam lembur per karyawan</li>
                    <li>• Gunakan pemilih bulan di atas untuk beralih antar bulan</li>
                </ul>
            </div>
            
                <AttendanceTable 
                    session={use(sessionPromise)}
                    employees={use(employeesPromise)}
                    attendanceTypes={use(attendanceTypesPromise)}
                />
        </main>
    )
}
