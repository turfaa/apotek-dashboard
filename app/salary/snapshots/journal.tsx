"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useSalarySnapshotJournal } from "@/lib/api/hooks"
import {
    SalaryJournalEntry,
    SalaryJournalLine,
    SalaryJournalStatus,
    SalarySnapshotJournal,
} from "@/lib/api/salary"
import { rupiah } from "@/lib/rupiah"
import { cn } from "@/lib/utils"

// Pieces shared by the Snapshot Gaji list and detail pages for posting
// snapshots to the Vmedis journal (Data Jurnal Keuangan).

// Where journal entries are corrected: Vmedis → Data Jurnal Keuangan.
export const VMEDIS_JOURNAL_URL = "https://aulia.vmedis.com/jurnal-v2"

// Names of the accounts salary journals use, by Vmedis account code.
const accountNames: Record<string, string> = {
    "111004": "Bank OCBC",
    "610002": "Gaji Karyawan",
    "171001": "Piutang Pegawai",
}

export function accountLabel(code: string): string {
    const name = accountNames[code]
    return name ? `${code} / ${name}` : code
}

function accountName(code: string): string {
    return accountNames[code] ?? code
}

// "2026-10-31" → "31 Oktober 2026".
export function formatJournalDate(date: string, pattern = "d MMMM yyyy"): string {
    return format(new Date(`${date}T00:00:00`), pattern, { locale: id })
}

const statusBadges: Record<SalaryJournalStatus, { label: string; className: string }> = {
    none: { label: "Belum diposting", className: "border-border text-muted-foreground bg-transparent" },
    posted: { label: "Sudah diposting", className: "border-transparent bg-primary text-primary-foreground" },
    partial: {
        label: "Gagal sebagian",
        className: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200",
    },
}

export function JournalStatusBadge({ status }: { status: SalaryJournalStatus }): React.ReactElement {
    const badge = statusBadges[status] ?? statusBadges.none
    return (
        <Badge variant="outline" className={cn("rounded-full font-medium whitespace-nowrap shadow-none", badge.className)}>
            {badge.label}
        </Badge>
    )
}

// An entry with an unknown outcome: it may or may not be in Vmedis.
export function isUncertain(entry: SalaryJournalEntry): boolean {
    return entry.status === "pending" && entry.error !== null
}

export function EntryStatusBadge({ entry }: { entry: SalaryJournalEntry }): React.ReactElement {
    if (entry.status === "posted") {
        return <Badge className="rounded-full font-medium shadow-none">Berhasil</Badge>
    }
    if (entry.status === "failed") {
        return <Badge variant="destructive" className="rounded-full font-medium shadow-none">Gagal</Badge>
    }
    return (
        <Badge variant="outline" className="rounded-full font-medium shadow-none border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200">
            {isUncertain(entry) ? "Belum pasti" : "Diproses"}
        </Badge>
    )
}

export function lineTitle(line: SalaryJournalLine): string {
    return line.kind === "salary" ? "Jurnal gaji" : `Pelunasan ${line.componentDescription ?? "utang"}`
}

export function lineAccounts(line: SalaryJournalLine): string {
    return `${accountName(line.creditAccount)} → ${accountName(line.debitAccount)}`
}

// The utang lines not posted: unticked when posting, or never postable.
export function untickedDebts(journal: SalarySnapshotJournal): SalaryJournalLine[] {
    return journal.lines.filter((line) => line.kind === "debt" && line.entry === null)
}

interface JournalSectionProps {
    snapshotID: number
}

// The "Jurnal Keuangan Vmedis" card of the snapshot detail page.
export function JournalSection({ snapshotID }: JournalSectionProps): React.ReactElement {
    const { data: journal, error, isLoading, mutate } = useSalarySnapshotJournal(snapshotID)

    return (
        <section className="rounded-lg border p-5 flex flex-col gap-3" aria-labelledby="journal-section-title">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="journal-section-title" className="text-base font-semibold">
                    Jurnal Keuangan Vmedis
                </h2>
                {journal?.postedAt && (
                    <span className="text-sm text-muted-foreground">
                        Diposting oleh {journal.postedByName ?? journal.postedBy} ·{" "}
                        {format(journal.postedAt, "d MMM yyyy HH:mm", { locale: id })}
                    </span>
                )}
            </div>

            {isLoading ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Memuat jurnal...
                </p>
            ) : error || !journal ? (
                <div className="flex flex-wrap items-center gap-3 text-sm text-destructive">
                    Gagal memuat status jurnal Vmedis.
                    <Button variant="outline" size="sm" onClick={() => mutate()}>
                        Coba lagi
                    </Button>
                </div>
            ) : (
                <JournalSectionBody journal={journal} />
            )}
        </section>
    )
}

function JournalSectionBody({ journal }: { journal: SalarySnapshotJournal }): React.ReactElement {
    const recorded = journal.lines.filter((line) => line.entry !== null)
    const unticked = untickedDebts(journal)

    if (journal.status === "none") {
        return (
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <p>
                    Snapshot ini belum diposting. Posting akan membuat jurnal gaji bertanggal{" "}
                    {formatJournalDate(journal.journalDate)} dan jurnal pelunasan untuk utang yang dipilih.
                </p>
                {journal.blockedReason && (
                    <p className="text-orange-800 dark:text-orange-200">
                        {journal.blockedReason}
                        {journal.otherPostedSnapshotID !== null && (
                            <>
                                {" "}
                                <Link className="underline" href={`/salary/snapshots/${journal.otherPostedSnapshotID}`}>
                                    Lihat snapshot #{journal.otherPostedSnapshotID}
                                </Link>
                            </>
                        )}
                    </p>
                )}
                {recorded.some((line) => line.entry?.status === "failed") && (
                    <p>Posting sebelumnya gagal; tidak ada jurnal yang dibuat di Vmedis.</p>
                )}
            </div>
        )
    }

    return (
        <>
            <div className="overflow-x-auto">
                <Table className="min-w-[640px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>No. Bukti</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Kredit → Debit</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead className="text-right">Nominal</TableHead>
                            {journal.status === "partial" && <TableHead>Status</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recorded.map((line) => (
                            <TableRow key={`${line.kind}-${line.componentIndex ?? ""}`}>
                                <TableCell className="whitespace-nowrap font-medium">
                                    {line.entry?.voucherNo ?? "—"}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {formatJournalDate(journal.journalDate, "d MMM yyyy")}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{lineAccounts(line)}</TableCell>
                                <TableCell>
                                    {line.description}
                                    {line.entry?.error && line.entry.status !== "posted" && (
                                        <div className="text-xs text-destructive mt-1">{line.entry.error}</div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">{rupiah.format(line.amount)}</TableCell>
                                {journal.status === "partial" && (
                                    <TableCell>{line.entry && <EntryStatusBadge entry={line.entry} />}</TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground">
                {unticked.length > 0 && (
                    <>
                        Utang yang tidak diposting: {unticked.map((line) => line.componentDescription).join(", ")}.{" "}
                    </>
                )}
                Untuk mengoreksi jurnal, ubah atau hapus langsung di Vmedis → Data Jurnal Keuangan.
            </p>
            <div>
                <Button variant="outline" asChild>
                    <a href={VMEDIS_JOURNAL_URL} target="_blank" rel="noopener noreferrer">
                        Buka Data Jurnal Keuangan di Vmedis
                        <ExternalLink />
                    </a>
                </Button>
            </div>
        </>
    )
}
