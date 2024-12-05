import { fetchAPI } from "./base"
import { Session } from "next-auth"
import { convertUnderlyingEmployee, Employee, UnderlyingEmployee } from "./employee"
import { buildDateRangeQueryParams } from "./common"

export interface CreateWorkLogRequest {
    employeeID: number
    patientName: string
    units: CreateWorkLogUnitRequest[]
}

export interface CreateWorkLogUnitRequest {
    workTypeID: number
    workOutcome: string
}

export interface WorkLog {
    id: number
    employee: Employee
    patientName: string
    units: WorkLogUnit[]
    createdAt: Date
}

export interface UnderlyingWorkLog {
    id: number
    employee: UnderlyingEmployee
    patientName: string
    units: UnderlyingWorkLogUnit[]
    createdAt: string
}

export interface WorkLogUnit {
    id: number
    workType: WorkType
    workOutcome: string
}

export interface UnderlyingWorkLogUnit {
    id: number
    workType: UnderlyingWorkType
    workOutcome: string
}

export interface CreateWorkTypeRequest {
    name: string
    outcomeUnit: string
    multiplier: number
    notes: string
}

export interface WorkType {
    id: number
    name: string
    outcomeUnit: string
    multiplier: number
    notes: string
}

export interface UnderlyingWorkType {
    id: number
    name: string
    outcomeUnit: string
    multiplier: string
    notes: string
}

export async function createWorkLog(request: CreateWorkLogRequest, session?: Session | null): Promise<WorkLog> {
    const response = await fetchAPI<WorkLog>("POST", "/work-logs", request, {}, {
        session: session,
    })
    return response
}

export async function getWorkLogs(
    from?: string,
    to?: string,
    session?: Session | null,
): Promise<WorkLog[]> {
    const underlyingWorkLogs = await fetchAPI<UnderlyingWorkLog[]>(
        "GET",
        `/work-logs?${buildDateRangeQueryParams(from, to)}`,
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
                
            },
        },
        {
            session: session,
        },
    )
    return underlyingWorkLogs.map(convertUnderlyingWorkLog)
}

export function convertUnderlyingWorkLog(underlyingWorkLog: UnderlyingWorkLog): WorkLog {
    return {
        ...underlyingWorkLog,
        createdAt: new Date(underlyingWorkLog.createdAt),
        employee: convertUnderlyingEmployee(underlyingWorkLog.employee),
        units: underlyingWorkLog.units.map(convertUnderlyingWorkLogUnit),
    }
}

export function convertUnderlyingWorkLogUnit(underlyingWorkLogUnit: UnderlyingWorkLogUnit): WorkLogUnit {
    return {
        ...underlyingWorkLogUnit,
        workType: convertUnderlyingWorkType(underlyingWorkLogUnit.workType),
    }
}

export async function createWorkType(createWorkTypeRequest: CreateWorkTypeRequest, session?: Session | null): Promise<WorkType> {
    return fetchAPI<WorkType>(
        "POST",
        "/work-types",
        createWorkTypeRequest,
        {},
        {
            forHRIS: true,
            session: session,
        }
    )
}

export async function getWorkTypes(session?: Session | null): Promise<WorkType[]> {
    const underlyingWorkTypes = await fetchAPI<UnderlyingWorkType[]>(
        "GET",
        "/work-types",
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
    return underlyingWorkTypes.map(convertUnderlyingWorkType)
}

export function convertUnderlyingWorkType(underlyingWorkType: UnderlyingWorkType): WorkType {
    return {
        ...underlyingWorkType,
        multiplier: parseFloat(underlyingWorkType.multiplier),
    }
}
