import { Session } from "next-auth"
import { fetchAPI } from "./base"

export interface Salary {
    components: SalaryComponent[]
    totalWithoutDebt: number
    total: number
    extraInfos: SalaryExtraInfo[]
}

export interface SalaryComponent {
    description: string
    multiplier: number
    amount: number
    total: number
}

export interface SalaryExtraInfo {
    id: number
    employeeID: number
    month: string
    title: string
    description: string
    createdAt: Date
}

export interface UnderlyingSalary {
    components: UnderlyingSalaryComponent[]
    totalWithoutDebt: string
    total: string
    extraInfos: UnderlyingSalaryExtraInfo[]

}

export interface UnderlyingSalaryComponent {
    description: string
    multiplier: string
    amount: string
    total: string
}

export interface UnderlyingSalaryExtraInfo {
    id: number
    employeeID: number
    month: string
    title: string
    description: string
    createdAt: string
}

export function convertUnderlyingSalary(
    underlyingSalary: UnderlyingSalary,
): Salary {
    return {
        components: underlyingSalary.components.map(
            convertUnderlyingSalaryComponent,
        ),
        totalWithoutDebt: parseFloat(underlyingSalary.totalWithoutDebt),
        total: parseFloat(underlyingSalary.total),
        extraInfos: underlyingSalary.extraInfos.map(
            convertUnderlyingSalaryExtraInfo,
        ),
    }
}

export function convertUnderlyingSalaryComponent(
    underlyingSalaryComponent: UnderlyingSalaryComponent,
): SalaryComponent {
    return {
        description: underlyingSalaryComponent.description,
        multiplier: parseFloat(underlyingSalaryComponent.multiplier),
        amount: parseFloat(underlyingSalaryComponent.amount),
        total: parseFloat(underlyingSalaryComponent.total),
    }
}

export function convertUnderlyingSalaryExtraInfo(
    underlyingSalaryExtraInfo: UnderlyingSalaryExtraInfo,
): SalaryExtraInfo {
    return {
        ...underlyingSalaryExtraInfo,
        createdAt: new Date(underlyingSalaryExtraInfo.createdAt),
    }
}

export async function getSalary(
    employeeID: number,
    month: string,
    session?: Session | null,
): Promise<Salary> {
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
