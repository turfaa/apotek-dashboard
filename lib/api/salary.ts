import { Session } from "next-auth"
import { fetchAPI } from "./base"

export interface Salary {
    components: SalaryComponent[]
    total: number
}

export interface SalaryComponent {
    description: string
    multiplier: number
    amount: number
    total: number
}

export interface UnderlyingSalary {
    components: UnderlyingSalaryComponent[]
    total: string
}

export interface UnderlyingSalaryComponent {
    description: string
    multiplier: string
    amount: string
    total: string
}

export function convertUnderlyingSalary(underlyingSalary: UnderlyingSalary): Salary {
    return {
        components: underlyingSalary.components.map(convertUnderlyingSalaryComponent),
        total: parseFloat(underlyingSalary.total),
    }
}

export function convertUnderlyingSalaryComponent(underlyingSalaryComponent: UnderlyingSalaryComponent): SalaryComponent {
    return {
        description: underlyingSalaryComponent.description,
        multiplier: parseFloat(underlyingSalaryComponent.multiplier),
        amount: parseFloat(underlyingSalaryComponent.amount),
        total: parseFloat(underlyingSalaryComponent.total),
    }
}

export async function getSalary(employeeID: number, month: string, session?: Session | null): Promise<Salary> {
    const underlying = await fetchAPI<UnderlyingSalary>(
        "GET",
        `/salary/${month}/${employeeID}`,
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

    return convertUnderlyingSalary(underlying)
}