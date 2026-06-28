import { Table } from "@/cui/types"
import { fetchAPI } from "./base"
import { Session } from "next-auth"
import { buildDateRangeQueryParams } from "./common"

export async function getShifts(
    from?: string,
    until?: string,
    session?: Session | null,
): Promise<Table> {
    return fetchAPI(
        "GET",
        `/shifts?${buildDateRangeQueryParams(from, until)}`,
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            version: "v2",
            session: session,
        },
    )
}

export enum ShiftDumpStatus {
    Idle = "IDLE",
    Dumping = "DUMPING",
}

export interface ShiftDumpStatusResponse {
    status: ShiftDumpStatus
}

export async function getShiftDumpStatus(): Promise<ShiftDumpStatusResponse> {
    return fetchAPI<ShiftDumpStatusResponse>(
        "GET",
        "/shifts/dump/status",
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            version: "v2",
        },
    )
}

export interface MessageResponse {
    message: string
}

export async function dumpShifts(
    from?: string,
    to?: string,
): Promise<MessageResponse> {
    return fetchAPI<MessageResponse>(
        "POST",
        "/shifts/dump",
        { from, to },
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            version: "v2",
        },
    )
}
