import { Session } from "next-auth"
import { fetchAPI } from "@/lib/api/base"
import { getEmployees } from "@/lib/api/employee"

// Purchase order letters (surat pesanan, SP): numbered letters on the
// pharmacy letterhead that order drugs from a supplier.

const basePath = "/procurements/purchase-orders"
// Browser-side path of the same endpoints, rewritten by the proxy.
const clientBasePath = `/api${basePath}`

const noCache = { next: { revalidate: 0 } }

export interface PurchaseOrderLetterTemplate {
    id: string
    name: string
    description: string
}

// The pharmacist who signs SPs (Apoteker Penanggung Jawab).
export interface PurchaseOrderLetterSigner {
    // Without the "apt." title.
    name: string
    // The pharmacist's SIPA.
    licenseNumber: string
}

export interface PurchaseOrderLetterOptions {
    templates: PurchaseOrderLetterTemplate[]
    signer: PurchaseOrderLetterSigner
    // The Vmedis page where suppliers are edited.
    vmedisSupplierPageUrl: string
}

// An HRIS employee, reduced to what the SP pages need.
export interface PurchaseOrderLetterEmployee {
    id: number
    name: string
}

export interface PurchaseOrderLetterItemInput {
    // Null for drugs added by hand that are not in Vmedis.
    drugVmedisCode: string | null
    drugName: string
    quantity: string
}

export interface CreatePurchaseOrderLetterRequest {
    templateId: string
    supplierVmedisId: number
    includePharmacistSignature: boolean
    createdByEmployee: PurchaseOrderLetterEmployee
    items: PurchaseOrderLetterItemInput[]
}

export interface CreatePurchaseOrderLetterResponse {
    id: number
    number: string
    createdAt: string
}

export interface PurchaseOrderLetterSummary {
    id: number
    number: string
    templateId: string
    templateName: string
    supplier: { vmedisId: number; name: string }
    itemCount: number
    includePharmacistSignature: boolean
    createdByEmployee: PurchaseOrderLetterEmployee
    createdByEmail: string
    createdAt: string
}

export interface PurchaseOrderLetterItem extends PurchaseOrderLetterItemInput {
    position: number
}

export interface PurchaseOrderLetterDetail
    extends Omit<PurchaseOrderLetterSummary, "supplier"> {
    // The supplier as it was when the SP was created.
    supplier: {
        vmedisId: number
        name: string
        address: string
        city: string
        phone: string
    }
    signer: PurchaseOrderLetterSigner | null
    items: PurchaseOrderLetterItem[]
}

export interface PurchaseOrderLettersResponse {
    purchaseOrders: PurchaseOrderLetterSummary[]
    total: number
    page: number
    pageSize: number
}

export interface PurchaseOrderLetterFilters {
    q?: string
    // YYYY-MM-DD, inclusive.
    from?: string
    to?: string
    supplierVmedisId?: number
    templateId?: string
    createdByEmployeeId?: number
    page?: number
    pageSize?: number
}

// An error response of the SP API, with the body's message.
export class PurchaseOrderLetterError extends Error {
    readonly status: number
    // Indexes of the items without a drug name or quantity.
    readonly invalidItems?: number[]

    constructor(status: number, message: string, invalidItems?: number[]) {
        super(message)
        this.name = "PurchaseOrderLetterError"
        this.status = status
        this.invalidItems = invalidItems
    }
}

export async function getPurchaseOrderLetterOptions(
    session?: Session | null,
): Promise<PurchaseOrderLetterOptions> {
    return fetchAPI<PurchaseOrderLetterOptions>(
        "GET",
        `${basePath}/options`,
        null,
        noCache,
        { session },
    )
}

export async function listPurchaseOrderLetters(
    filters: PurchaseOrderLetterFilters,
    session?: Session | null,
): Promise<PurchaseOrderLettersResponse> {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== "") {
            params.set(key, String(value))
        }
    }

    const query = params.toString()
    return fetchAPI<PurchaseOrderLettersResponse>(
        "GET",
        `${basePath}${query ? `?${query}` : ""}`,
        null,
        noCache,
        { session },
    )
}

export async function listPurchaseOrderLetterCreators(
    session?: Session | null,
): Promise<PurchaseOrderLetterEmployee[]> {
    const res = await fetchAPI<{ creators: PurchaseOrderLetterEmployee[] }>(
        "GET",
        `${basePath}/creators`,
        null,
        noCache,
        { session },
    )
    return res.creators
}

export async function getPurchaseOrderLetter(
    id: number,
    session?: Session | null,
): Promise<PurchaseOrderLetterDetail> {
    return fetchAPI<PurchaseOrderLetterDetail>(
        "GET",
        `${basePath}/${id}`,
        null,
        noCache,
        { session },
    )
}

// Lists the current employees for "Dibuat oleh", sorted by name. Reads HRIS
// on the server and keeps only the id and name, because the HRIS employee
// list also has their shift fees.
export async function getPurchaseOrderLetterEmployees(
    session?: Session | null,
): Promise<PurchaseOrderLetterEmployee[]> {
    const employees = await getEmployees(session)

    return employees
        .filter((employee) => employee.showInAttendances)
        .map(({ id, name }) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name, "id"))
}

// Creates an SP from the browser. Throws PurchaseOrderLetterError with the
// backend's message on an error response.
export async function createPurchaseOrderLetter(
    request: CreatePurchaseOrderLetterRequest,
): Promise<CreatePurchaseOrderLetterResponse> {
    const res = await fetch(clientBasePath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        throw await toError(res)
    }

    return res.json()
}

// Downloads an SP's PDF in the browser, under the name the backend gives it.
export async function downloadPurchaseOrderLetterPdf(id: number): Promise<void> {
    const res = await fetch(`${clientBasePath}/${id}/pdf`)
    if (!res.ok) {
        throw await toError(res)
    }

    const blob = await res.blob()
    const filename =
        filenameFromContentDisposition(res.headers.get("Content-Disposition")) ??
        `surat-pesanan-${id}.pdf`

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Revoke later: some browsers start the download asynchronously.
    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000)
}

async function toError(res: Response): Promise<PurchaseOrderLetterError> {
    let message = res.statusText || `HTTP ${res.status}`
    let invalidItems: number[] | undefined

    try {
        const body = await res.json()
        if (typeof body?.error === "string") message = body.error
        else if (typeof body?.message === "string") message = body.message
        if (Array.isArray(body?.invalidItems)) invalidItems = body.invalidItems
    } catch {
        // Not JSON: keep the status text.
    }

    return new PurchaseOrderLetterError(res.status, message, invalidItems)
}

export function filenameFromContentDisposition(
    header: string | null,
): string | undefined {
    if (!header) return undefined

    const encoded = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)
    if (encoded) {
        try {
            return decodeURIComponent(encoded[1].trim())
        } catch {
            // Fall back to the plain filename.
        }
    }

    const plain = header.match(/filename\s*=\s*"([^"]*)"/i)
    return plain?.[1] || undefined
}
