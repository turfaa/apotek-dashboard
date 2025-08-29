import { fetchAPI } from "./base"
import { Session } from "next-auth"

export interface GetAttendancesResponse {
    dailyAttendances: AttendancesAtDate[]
    employeeSummaries: EmployeeAttendanceSummary[]
}

export interface EmployeeAttendanceSummary {
    employeeID: number
    workingDays: number
    daysByBenefit: Record<string, number>
    overtimeHours: number
}

export interface AttendancesAtDate {
    date: string
    attendances: Attendance[]
}

export interface Attendance {
    id: number
    employeeID: number
    date: string
    type: AttendanceType
    overtimeHours: number
    createdAt: Date
    updatedAt: Date
    lastOperatorEmployeeID: number
}

export interface UnderlyingAttendance {
    id: number
    employeeID: number
    date: string
    type: AttendanceType
    overtimeHours: number
    createdAt: string
    updatedAt: string
    lastOperatorEmployeeID: number
}

export interface AttendanceType {
    id: number
    name: string
    payableType: PayableType
}

export interface UpsertAttendanceRequest {
    employeeID: number
    date: string
    typeID: number
    overtimeHours: number
}

export interface CreateAttendanceTypeRequest {
    name: string
    payableType: PayableType
}

export enum PayableType {
    Working = "working",
    Benefit = "benefit",
    None = "none",
}

// month is in format "YYYY-MM".
export async function getAttendances(month: string, session?: Session | null): Promise<GetAttendancesResponse> {
    return await fetchAPI<GetAttendancesResponse>(
        "GET",
        `/attendances?month=${month}`,
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

export async function upsertAttendance(request: UpsertAttendanceRequest, session?: Session | null): Promise<void> {
    await fetchAPI<void>(
        "PUT",
        `/attendances/${request.employeeID}/${request.date}`,
        {
            typeID: request.typeID,
            overtimeHours: request.overtimeHours,
        },
        {},
        {
            forHRIS: true,
            session: session,
        },
    )
}

export async function createAttendanceType(request: CreateAttendanceTypeRequest, session?: Session | null): Promise<AttendanceType> {
    return await fetchAPI<AttendanceType>(
        "POST", 
        "/attendances/types", 
        request, 
        {}, 
        {
            forHRIS: true,
            session: session,
        },
    )
}

export async function getAttendanceTypes(session?: Session | null): Promise<AttendanceType[]> {
    return await fetchAPI<AttendanceType[]>(
        "GET", 
        "/attendances/types", 
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