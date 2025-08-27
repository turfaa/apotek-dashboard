import { fetchAPI } from "./base"
import { Session } from "next-auth"

export interface AttendanceType {
    id: number
    name: string
    payableType: PayableType
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