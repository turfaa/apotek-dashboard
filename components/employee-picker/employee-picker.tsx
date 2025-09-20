"use client"

import { usePrintMode } from "@/lib/print-mode"
import { Title } from "@/components/typography"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useTransition } from "react"
import { PersonIcon } from "@radix-ui/react-icons"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Employee } from "@/lib/api/employee"

interface EmployeePickerProps {
    employees: Employee[]
}

export function EmployeePicker({ employees }: EmployeePickerProps): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const { push } = useRouter()
    const pathname: string = usePathname()
    const { isPrintMode } = usePrintMode()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const employeeIdFromParams = searchParams.get("employeeID")
    const selectedEmployee = employeeIdFromParams 
        ? employees.find(emp => emp.id.toString() === employeeIdFromParams)
        : null
    const employeeName = selectedEmployee ? selectedEmployee.name : "Pilih Karyawan"

    if (isPrintMode) {
        return <Title>{employeeName}</Title>
    }

    return (
        <Select
            value={employeeIdFromParams || ""}
            onValueChange={(value) => {
                const params: URLSearchParams = new URLSearchParams(
                    window.location.search,
                )
                if (value) {
                    params.set("employeeID", value)
                } else {
                    params.delete("employeeID")
                }

                startTransition(() => {
                    push(`${pathname}?${params.toString()}`)
                })
            }}
            disabled={isPending}
        >
            <SelectTrigger className="w-[240px]">
                <div className="flex items-center">
                    <PersonIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Pilih Karyawan" className="text-left" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {employees.map((employee) => (
                    <SelectItem
                        key={employee.id}
                        value={employee.id.toString()}
                    >
                        {employee.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
