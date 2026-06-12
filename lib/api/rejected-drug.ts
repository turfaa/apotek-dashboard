import { Form, Options, Table } from "@/cui/types"
import { fetchAPI } from "./base"
import { Session } from "next-auth"

export enum RejectedDrugResolution {
    UNRESOLVED = "UNRESOLVED",
    ORDERED = "ORDERED",
    STOCKED = "STOCKED",
    SUBSTITUTED = "SUBSTITUTED",
    WILL_NOT_STOCK = "WILL_NOT_STOCK",
}

export interface RejectedDrug {
    id: number
    createdAt: string
    updatedAt: string
    drugName: string
    resolution: RejectedDrugResolution
    resolutionNotes: string
    resolvedAt?: string
    createdBy: string
    resolvedBy?: string
}

export interface RejectedDrugResponse {
    rejectedDrug: RejectedDrug
}

export interface CreateRejectedDrugRequest {
    drugName: string
}

export interface UpdateRejectedDrugRequest {
    drugName?: string
    resolution?: string
    resolutionNotes?: string
}

export interface RejectedDrugFilters {
    query?: string
    drugName?: string
    resolutionNotes?: string
    resolutions?: string
    createdBy?: string
    resolvedBy?: string
    date?: string
    from?: string
    until?: string
    resolvedFrom?: string
    resolvedUntil?: string
}

export async function getRejectedDrugs(
    filters: RejectedDrugFilters = {},
    session?: Session | null,
): Promise<Table> {
    return fetchAPI(
        "GET",
        `/rejected-drugs?${buildFilterQueryParams(filters)}`,
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

export async function getRejectedDrug(
    id: number,
    session?: Session | null,
): Promise<Table> {
    return fetchAPI(
        "GET",
        `/rejected-drugs/${id}`,
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

export async function getRejectedDrugResolutions(
    session?: Session | null,
): Promise<Options> {
    return fetchAPI(
        "GET",
        "/rejected-drugs/resolutions",
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

export async function getCreateRejectedDrugForm(
    session?: Session | null,
): Promise<Form> {
    return fetchAPI(
        "GET",
        "/rejected-drugs/form",
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

export async function getUpdateRejectedDrugForm(
    id: number,
    session?: Session | null,
): Promise<Form> {
    return fetchAPI(
        "GET",
        `/rejected-drugs/${id}/form`,
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

export async function createRejectedDrug(
    request: CreateRejectedDrugRequest,
    session?: Session | null,
): Promise<RejectedDrugResponse> {
    return fetchAPI(
        "POST",
        "/rejected-drugs",
        request,
        {},
        {
            version: "v2",
            session: session,
        },
    )
}

export async function updateRejectedDrug(
    id: number,
    request: UpdateRejectedDrugRequest,
    session?: Session | null,
): Promise<RejectedDrugResponse> {
    return fetchAPI(
        "PATCH",
        `/rejected-drugs/${id}`,
        request,
        {},
        {
            version: "v2",
            session: session,
        },
    )
}

export async function deleteRejectedDrug(
    id: number,
    session?: Session | null,
): Promise<void> {
    await fetchAPI(
        "DELETE",
        `/rejected-drugs/${id}`,
        null,
        {},
        {
            version: "v2",
            session: session,
        },
    )
}

function buildFilterQueryParams(filters: RejectedDrugFilters): string {
    const params = new URLSearchParams()

    const queryParams: Record<string, string | undefined> = {
        query: filters.query,
        drug_name: filters.drugName,
        resolution_notes: filters.resolutionNotes,
        resolutions: filters.resolutions,
        created_by: filters.createdBy,
        resolved_by: filters.resolvedBy,
        date: filters.date,
        from: filters.from,
        until: filters.until,
        resolved_from: filters.resolvedFrom,
        resolved_until: filters.resolvedUntil,
    }

    for (const [key, value] of Object.entries(queryParams)) {
        if (value) {
            params.set(key, value)
        }
    }

    return params.toString()
}
