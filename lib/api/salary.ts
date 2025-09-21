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

/**
 * The difference between Static Component and Additional Component
 * is that Static Component is applicable every month,
 * while Additional Component is applicable only for a specific month.
 */
export interface SalaryStaticComponent {
    id: number
    employeeID: number
    description: string
    amount: number
    multiplier: number
    total: number
}

/**
 * The difference between Static Component and Additional Component
 * is that Static Component is applicable every month,
 * while Additional Component is applicable only for a specific month.
 */
export interface SalaryAdditionalComponent {
    id: number
    employeeID: number
    month: string
    description: string
    amount: number
    multiplier: number
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

export async function getSalaryStaticComponents(
    employeeID: number,
    session?: Session | null,
): Promise<SalaryStaticComponent[]> {
    return await fetchAPI<SalaryStaticComponent[]>(
        "GET",
        `/salary/${employeeID}/static-components`,
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
}

export async function createSalaryStaticComponent(
    employeeID: number,
    description: string,
    amount: number,
    multiplier: number,
    session?: Session | null,
): Promise<SalaryStaticComponent> {
    return await fetchAPI<SalaryStaticComponent>(
        "POST",
        `/salary/${employeeID}/static-components`,
        { description, amount, multiplier },
        {},
        {
            forHRIS: true,
            session: session,
        },
    )
}

export async function deleteSalaryStaticComponent(
    employeeID: number,
    componentID: number,
    session?: Session | null,
): Promise<void> {
    await fetchAPI<void>(
        "DELETE",
        `/salary/${employeeID}/static-components/${componentID}`,
        null,
        {},
        {
            forHRIS: true,
            session: session,
        },
    )
}

export async function getSalaryAdditionalComponents(
    employeeID: number,
    month: string,
    session?: Session | null,
): Promise<SalaryAdditionalComponent[]> {
    return await fetchAPI<SalaryAdditionalComponent[]>(
        "GET",
        `/salary/${month}/${employeeID}/additional-components`,
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
}

export async function createSalaryAdditionalComponent(
    employeeID: number,
    month: string,
    description: string,
    amount: number,
    multiplier: number,
    session?: Session | null,
): Promise<SalaryAdditionalComponent> {
    return await fetchAPI<SalaryAdditionalComponent>(
        "POST",
        `/salary/${month}/${employeeID}/additional-components`,
        { description, amount, multiplier },
        {},
        {
            forHRIS: true,
            session: session,
        },
    )
}

export async function deleteSalaryAdditionalComponent(
    employeeID: number,
    month: string,
    componentID: number,
    session?: Session | null,
): Promise<void> {
    await fetchAPI<void>(
        "DELETE",
        `/salary/${month}/${employeeID}/additional-components/${componentID}`,
        null,
        {},
        {
            forHRIS: true,
            session: session,
        },
    )
}

export async function getSalaryExtraInfos(
    employeeID: number,
    month: string,
    session?: Session | null,
): Promise<SalaryExtraInfo[]> {
    return await fetchAPI<SalaryExtraInfo[]>(
        "GET",
        `/salary/${month}/${employeeID}/extra-infos`,
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
}

export async function createSalaryExtraInfo(
    employeeID: number,
    month: string,
    title: string,
    description: string,
    session?: Session | null,
): Promise<SalaryExtraInfo> {
    return await fetchAPI<SalaryExtraInfo>(
        "POST",
        `/salary/${month}/${employeeID}/extra-infos`,
        { title, description },
        {},
        {
            forHRIS: true,
            session: session,
        },
    )
}

export async function deleteSalaryExtraInfo(
    employeeID: number,
    month: string,
    infoID: number,
    session?: Session | null,
): Promise<void> {
    await fetchAPI<void>(
        "DELETE",
        `/salary/${month}/${employeeID}/extra-infos/${infoID}`,
        null,
        {},
        {
            forHRIS: true,
            session: session,
        },
    )
}