import { Session } from "next-auth"
import { fetchAPI } from "@/lib/api/base"
import { getEmployees } from "@/lib/api/employee"
import { saveResponseAsFile } from "@/lib/download"

// Purchase order letters (surat pesanan, SP): numbered letters on the
// pharmacy letterhead that order drugs from a supplier.

const basePath = "/procurements/purchase-orders"
// Browser-side path of the same endpoints, rewritten by the proxy.
const clientBasePath = `/api${basePath}`

const noCache = { next: { revalidate: 0 } }

// "basic": a drug name and a free-text quantity ("10 Box").
// "controlled" (Prekursor, OOT): also zat aktif and bentuk & kekuatan from
// Vmedis, kemasan terkecil, a whole-number quantity with its words, and an
// optional keterangan.
export type PurchaseOrderLetterItemFields = "basic" | "controlled"

// "optional": the APJ signature block is printed only when asked.
// "wet": always printed, with space for a wet signature and stamp.
export type PurchaseOrderLetterSignatureMode = "optional" | "wet"

export interface PurchaseOrderLetterTemplate {
    id: string
    name: string
    description: string
    // Missing from backends older than the Prekursor/OOT templates.
    itemFields?: PurchaseOrderLetterItemFields
    signatureMode?: PurchaseOrderLetterSignatureMode
}

export function isControlledTemplate(
    template?: Pick<PurchaseOrderLetterTemplate, "itemFields">,
): boolean {
    return template?.itemFields === "controlled"
}

export function hasWetSignature(
    template?: Pick<PurchaseOrderLetterTemplate, "signatureMode">,
): boolean {
    return template?.signatureMode === "wet"
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
    // The Vmedis page where drugs (Data Obat) are edited.
    vmedisDrugPageUrl?: string
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
    // Free text ("10 Box") on basic templates, a whole number ("12") on
    // controlled ones.
    quantity: string
    // Controlled templates only. Zat aktif and bentuk & kekuatan are not
    // sent: the backend takes them from Vmedis.
    smallestPackage?: string
    note?: string | null
}

// What Vmedis has on a drug, for the controlled item fields.
export interface PurchaseOrderLetterItemDetails {
    drugVmedisCode: string
    // False when the drug is not in the synced Vmedis drugs.
    found: boolean
    activeIngredient: string | null
    dosageFormStrength: string | null
    // From the smallest unit.
    units: {
        unit: string
        // Empty for the smallest unit.
        parentUnit: string
        conversionToParentUnit: number
    }[]
    vmedisGolongan: string | null
    // Null when the golongan is not a drug class (e.g. a shelf).
    classMatches: boolean | null
    missingInVmedis: ("activeIngredient" | "dosageFormStrength")[]
}

export type PurchaseOrderLetterStatus = "active" | "cancelled"

export interface PurchaseOrderLetterCancellation {
    cancelledAt: string
    reason: string
    cancelledByEmployee: PurchaseOrderLetterEmployee
    cancelledByEmail: string
}

export interface CancelPurchaseOrderLetterRequest {
    reason: string
    cancelledByEmployee: PurchaseOrderLetterEmployee
}

export interface CreatePurchaseOrderLetterRequest {
    // Made once per dialog opening. A retry with the same key (e.g. after a
    // lost response) returns the SP the first request created instead of
    // using up another number.
    idempotencyKey: string
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
    // True when an earlier request with the same idempotency key created it.
    replayed: boolean
}

export interface PurchaseOrderLetterSummary {
    id: number
    number: string
    templateId: string
    templateName: string
    // Missing from older backends.
    templateItemFields?: PurchaseOrderLetterItemFields
    status?: PurchaseOrderLetterStatus
    supplier: { vmedisId: number; name: string }
    itemCount: number
    includePharmacistSignature: boolean
    createdByEmployee: PurchaseOrderLetterEmployee
    createdByEmail: string
    createdAt: string
    cancellation?: PurchaseOrderLetterCancellation | null
}

export interface PurchaseOrderLetterItem {
    position: number
    drugVmedisCode: string | null
    drugName: string
    quantity: string
    // Set on controlled templates, null otherwise.
    activeIngredient?: string | null
    dosageFormStrength?: string | null
    smallestPackage?: string | null
    quantityWords?: string | null
    note?: string | null
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
    status?: PurchaseOrderLetterStatus
    page?: number
    pageSize?: number
}

// An error response of the SP API, with the body's message.
export class PurchaseOrderLetterError extends Error {
    readonly status: number
    // Indexes of the invalid items.
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

// Lists the active employees for "Dibuat oleh", sorted by name. Reads HRIS
// on the server and keeps only the id and name, because the HRIS employee
// list also has their shift fees.
export async function getPurchaseOrderLetterEmployees(
    session?: Session | null,
): Promise<PurchaseOrderLetterEmployee[]> {
    const employees = await getEmployees(session)

    return employees
        .filter((employee) => employee.isActive)
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

// Gets what the synced Vmedis drugs have on the drugs for a template's
// controlled item fields. Reads the backend's database, not Vmedis.
export async function getPurchaseOrderLetterItemDetails(
    templateId: string,
    codes: string[],
): Promise<PurchaseOrderLetterItemDetails[]> {
    const params = new URLSearchParams({ templateId, codes: codes.join(",") })
    const res = await fetch(`${clientBasePath}/item-details?${params}`)
    if (!res.ok) {
        throw await toError(res)
    }

    return (await res.json()).items
}

// Fetches the drugs from Vmedis again (after they were filled in there) and
// returns their item details.
export async function refreshPurchaseOrderLetterItemDetails(
    templateId: string,
    codes: string[],
): Promise<PurchaseOrderLetterItemDetails[]> {
    const res = await fetch(`${clientBasePath}/item-details/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, codes }),
    })
    if (!res.ok) {
        throw await toError(res)
    }

    return (await res.json()).items
}

// Cancels an SP from the browser. Throws PurchaseOrderLetterError (409 when
// it is already cancelled).
export async function cancelPurchaseOrderLetter(
    id: number,
    request: CancelPurchaseOrderLetterRequest,
): Promise<PurchaseOrderLetterDetail> {
    const res = await fetch(`${clientBasePath}/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    })
    if (!res.ok) {
        throw await toError(res)
    }

    return res.json()
}

export function isCancelled(
    po: Pick<PurchaseOrderLetterSummary, "status" | "cancellation">,
): boolean {
    return po.status === "cancelled" || !!po.cancellation
}

// Downloads an SP's PDF in the browser, under the name the backend gives it.
export async function downloadPurchaseOrderLetterPdf(id: number): Promise<void> {
    const res = await fetch(`${clientBasePath}/${id}/pdf`)
    if (!res.ok) {
        throw await toError(res)
    }

    await saveResponseAsFile(res, `surat-pesanan-${id}.pdf`)
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
