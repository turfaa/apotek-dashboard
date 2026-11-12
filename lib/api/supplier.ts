import { Session } from "next-auth"
import { fetchAPI } from "./base"

export interface Supplier {
    vmedisId: number
    code: string
    name: string
    address: string
    city: string
    phone: string
    mobilePhone: string
    bankAccountNumber: string
    taxNumber: string
    active: boolean
    leadTimeDays: number
    rating: number
    // When the supplier was last synced from Vmedis.
    updatedAt: string
}

export interface SuppliersResponse {
    suppliers: Supplier[]
}

export async function getSuppliers(
    session?: Session | null,
): Promise<SuppliersResponse> {
    return fetchAPI<SuppliersResponse>(
        "GET",
        "/suppliers",
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            version: "v1",
            session: session,
        },
    )
}

export enum SupplierDumpStatus {
    Idle = "IDLE",
    Dumping = "DUMPING",
}

export interface SupplierDumpStatusResponse {
    status: SupplierDumpStatus
}

export async function getSupplierDumpStatus(): Promise<SupplierDumpStatusResponse> {
    return fetchAPI<SupplierDumpStatusResponse>(
        "GET",
        "/suppliers/dump/status",
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            version: "v1",
        },
    )
}

export interface MessageResponse {
    message: string
}

export async function dumpSuppliers(): Promise<MessageResponse> {
    return fetchAPI<MessageResponse>(
        "POST",
        "/suppliers/dump",
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            version: "v1",
        },
    )
}
