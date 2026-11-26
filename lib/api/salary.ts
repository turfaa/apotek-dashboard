import { Session } from "next-auth"
import { fetchAPI } from "./base"
import { buildQueryParams } from "./common"
import { saveResponseAsFile } from "@/lib/download"

export interface SalarySnapshot {
    id: number
    employeeID: number
    month: string
    salary: Salary
    createdAt: Date
    // Whether the snapshot is posted to the Vmedis journal (Jurnal Keuangan).
    journalStatus: SalaryJournalStatus
}

// "none": nothing posted; "posted": every entry posted; "partial": some
// entries posted (or being posted) and some failed or with an unknown outcome.
export type SalaryJournalStatus = "none" | "posted" | "partial"

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

export interface UnderlyingSalarySnapshot {
    id: number
    employeeID: number
    month: string
    salary: UnderlyingSalary
    createdAt: string
    // Missing from the snapshot a create returns.
    journalStatus?: SalaryJournalStatus
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

export interface GetSalarySnapshotsRequest {
    month?: string
    employeeID?: number
}

export function convertUnderlyingSalarySnapshot(
    underlyingSalarySnapshot: UnderlyingSalarySnapshot,
): SalarySnapshot {
    return {
        ...underlyingSalarySnapshot,
        salary: convertUnderlyingSalary(underlyingSalarySnapshot.salary),
        createdAt: new Date(underlyingSalarySnapshot.createdAt),
        journalStatus: underlyingSalarySnapshot.journalStatus ?? "none",
    }
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

export interface BulkCreateAdditionalComponentRequest {
    month: string
    employeeIDs: number[]
    component: {
        description: string
        amount: string
        multiplier: string
    }
}

export async function bulkCreateSalaryAdditionalComponents(
    month: string,
    employeeIDs: number[],
    description: string,
    amount: number,
    multiplier: number,
    session?: Session | null,
): Promise<SalaryAdditionalComponent[]> {
    const request: BulkCreateAdditionalComponentRequest = {
        month,
        employeeIDs,
        component: {
            description,
            amount: amount.toString(),
            multiplier: multiplier.toString(),
        },
    }
    return await fetchAPI<SalaryAdditionalComponent[]>(
        "POST",
        `/salary/${month}/additional-components/bulk`,
        request,
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

export async function getSalarySnapshots(
    request: GetSalarySnapshotsRequest,
    session?: Session | null,
): Promise<SalarySnapshot[]> {
    const queryParams = buildQueryParams(request)

    const underlying = await fetchAPI<UnderlyingSalarySnapshot[]>(
        "GET",
        `/salary/snapshots?${queryParams}`,
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

    return underlying.map(convertUnderlyingSalarySnapshot)
}

export async function getSalarySnapshot(
    snapshotID: number,
    session?: Session | null,
): Promise<SalarySnapshot> {
    const underlying = await fetchAPI<UnderlyingSalarySnapshot>(
        "GET",
        `/salary/snapshots/${snapshotID}`,
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

    return convertUnderlyingSalarySnapshot(underlying)
}

export async function createSalarySnapshot(
    employeeID: number,
    month: string,
    session?: Session | null,
): Promise<SalarySnapshot> {
    return await fetchAPI<SalarySnapshot>(
        "POST",
        `/salary/snapshots`,
        { employeeID, month },
        {},
        {
            forHRIS: true,
            session: session,
        },
    )
}

// Deletes a snapshot, from the browser. Throws SalaryApiError, with HRIS's
// message: a snapshot posted to the Vmedis journal can't be deleted (409).
export async function deleteSalarySnapshot(snapshotID: number): Promise<void> {
    const res = await fetch(`/api/salary/snapshots/${snapshotID}`, { method: "DELETE" })
    if (!res.ok) {
        throw await toSalaryApiError(res)
    }
}

// The Vmedis journal entries (Jurnal Keuangan) of a snapshot: the salary
// entry and one repayment entry per utang component, with their recorded
// outcome once posted.
export interface SalarySnapshotJournal {
    snapshotID: number
    status: SalaryJournalStatus
    // The email and name of the admin who posted it, and when the first
    // entry was posted. Null until something is posted.
    postedBy: string | null
    postedByName: string | null
    postedAt: Date | null
    // YYYY-MM-DD: the last day of the snapshot's month.
    journalDate: string
    snapshotCreatedAt: Date
    // Whether posting (or posting again) would send anything.
    canPost: boolean
    blockedReason: string | null
    // Another snapshot of the same employee and month that is posted.
    otherPostedSnapshotID: number | null
    // The salary line first, then the utang lines in component order.
    lines: SalaryJournalLine[]
}

export interface SalaryJournalLine {
    kind: "salary" | "debt"
    // The utang component's index in salary.components, for debt lines.
    componentIndex: number | null
    componentDescription: string | null
    // The keterangan in Vmedis.
    description: string
    creditAccount: string
    debitAccount: string
    amount: number
    postable: boolean
    warning: string | null
    entry: SalaryJournalEntry | null
}

export interface SalaryJournalEntry {
    // "pending" with an error is an entry whose outcome is unknown.
    status: "pending" | "posted" | "failed"
    voucherNo: string | null
    error: string | null
    postedAt: Date | null
}

interface UnderlyingSalarySnapshotJournal
    extends Omit<SalarySnapshotJournal, "postedAt" | "snapshotCreatedAt" | "lines"> {
    postedAt: string | null
    snapshotCreatedAt: string
    lines: (Omit<SalaryJournalLine, "amount" | "entry"> & {
        amount: string
        entry: (Omit<SalaryJournalEntry, "postedAt"> & { postedAt: string | null }) | null
    })[]
}

function convertSalarySnapshotJournal(u: UnderlyingSalarySnapshotJournal): SalarySnapshotJournal {
    return {
        ...u,
        postedAt: u.postedAt ? new Date(u.postedAt) : null,
        snapshotCreatedAt: new Date(u.snapshotCreatedAt),
        lines: u.lines.map((line) => ({
            ...line,
            amount: parseFloat(line.amount),
            entry: line.entry
                ? { ...line.entry, postedAt: line.entry.postedAt ? new Date(line.entry.postedAt) : null }
                : null,
        })),
    }
}

// Gets a snapshot's journal, from the browser. Throws SalaryApiError.
export async function getSalarySnapshotJournal(snapshotID: number): Promise<SalarySnapshotJournal> {
    const res = await fetch(`/api/salary/snapshots/${snapshotID}/journal`, { cache: "no-store" })
    if (!res.ok) {
        throw await toSalaryApiError(res)
    }

    return convertSalarySnapshotJournal(await res.json())
}

// Posts a snapshot to the Vmedis journal with the chosen utang repayments,
// or, once anything is posted, sends again only the entries that failed. It
// resolves with the journal after the attempt, whatever each entry's outcome.
// Throws SalaryApiError.
export async function postSalarySnapshotJournal(
    snapshotID: number,
    debtComponentIndexes: number[],
): Promise<SalarySnapshotJournal> {
    const res = await fetch(`/api/salary/snapshots/${snapshotID}/journal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debtComponentIndexes }),
    })
    if (!res.ok) {
        throw await toSalaryApiError(res)
    }

    return convertSalarySnapshotJournal(await res.json())
}

// An error response of HRIS, with its message.
export class SalaryApiError extends Error {
    readonly status: number
    // The posted snapshot of the same employee and month, on a 409 that is
    // about it.
    readonly otherSnapshotID: number | null

    constructor(status: number, message: string, otherSnapshotID: number | null = null) {
        super(message)
        this.name = "SalaryApiError"
        this.status = status
        this.otherSnapshotID = otherSnapshotID
    }
}

async function toSalaryApiError(res: Response): Promise<SalaryApiError> {
    let message = res.statusText || `HTTP ${res.status}`
    let otherSnapshotID: number | null = null

    try {
        const body = await res.json()
        if (typeof body?.message === "string") message = body.message
        else if (typeof body?.error === "string") message = body.error
        if (typeof body?.otherSnapshotID === "number") otherSnapshotID = body.otherSnapshotID
    } catch {
        // Not JSON: keep the status text.
    }

    return new SalaryApiError(res.status, message, otherSnapshotID)
}

// An error response of the pay slip (slip gaji) downloads.
export class SalarySlipError extends Error {
    readonly status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = "SalarySlipError"
        this.status = status
    }
}

// Downloads a snapshot's pay slip PDF in the browser, named
// "YYYY-MM - <name> - Slip Gaji.pdf" by HRIS. Throws SalarySlipError.
export async function downloadSalarySlipPdf(snapshotID: number): Promise<void> {
    const res = await fetch(`/api/salary/snapshots/${snapshotID}/pdf`)
    if (!res.ok) {
        throw await toSalarySlipError(res)
    }

    await saveResponseAsFile(res, `slip-gaji-${snapshotID}.pdf`)
}

// Downloads a ZIP of the pay slips of a month's snapshots, of one employee
// when employeeID is set, named "YYYY-MM - Slip Gaji.zip". Throws
// SalarySlipError.
export async function downloadSalarySlipsZip(
    month: string,
    employeeID?: number,
): Promise<void> {
    const params = new URLSearchParams({ month })
    if (employeeID !== undefined) {
        params.set("employeeID", String(employeeID))
    }

    const res = await fetch(`/api/salary/snapshots/slips.zip?${params}`)
    if (!res.ok) {
        throw await toSalarySlipError(res)
    }

    await saveResponseAsFile(res, `${month} - Slip Gaji.zip`)
}

async function toSalarySlipError(res: Response): Promise<SalarySlipError> {
    let message = res.statusText || `HTTP ${res.status}`

    try {
        const body = await res.json()
        if (typeof body?.error === "string") message = body.error
        else if (typeof body?.message === "string") message = body.message
    } catch {
        // Not JSON: keep the status text.
    }

    return new SalarySlipError(res.status, message)
}
