import { fetchAPI } from "@/lib/api/base"
import { Session } from "next-auth"

export interface Employee {
    id: number
    name: string
    shiftFee: number
    createdAt: Date
    updatedAt: Date
}

export interface UnderlyingEmployee {
    id: number
    name: string
    shiftFee: string
    createdAt: string
    updatedAt: string
}

export async function getEmployees(session?: Session | null): Promise<Employee[]> {
    const underlyingEmployees = await fetchAPI<UnderlyingEmployee[]>(
        "GET",
        "/employees",
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            forHRIS: true,
            session: session,
        },
    )

    return underlyingEmployees.map(convertUnderlyingEmployee)
}

export function convertUnderlyingEmployee(underlyingEmployee: UnderlyingEmployee): Employee {
    return {
        id: underlyingEmployee.id,
        name: underlyingEmployee.name,
        shiftFee: parseFloat(underlyingEmployee.shiftFee),
        createdAt: new Date(underlyingEmployee.createdAt),
        updatedAt: new Date(underlyingEmployee.updatedAt),
    }
}

export async function createEmployee(name: string, shiftFee: number, session?: Session | null): Promise<Employee> {
    return fetchAPI<Employee>("POST", "/employees", { name, shiftFee }, {}, {
        forHRIS: true,
        session: session,
    })
}