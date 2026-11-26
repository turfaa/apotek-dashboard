"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useSalarySnapshotJournal } from "@/lib/api/hooks"
import {
    SalaryApiError,
    SalaryJournalLine,
    SalarySnapshotJournal,
    postSalarySnapshotJournal,
} from "@/lib/api/salary"
import { rupiah } from "@/lib/rupiah"
import {
    EntryStatusBadge,
    accountLabel,
    formatJournalDate,
    isUncertain,
    lineAccounts,
    lineTitle,
} from "./journal"

interface PostJournalDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    snapshotID: number | null
    employeeName: string
    monthDisplay: string
    // Called after every post attempt, e.g. to reload the snapshot list.
    onPosted?: () => void
}

// Previews and posts a snapshot's Vmedis journal entries: the salary entry
// and the ticked utang repayments the first time, and only the failed ones
// afterwards.
export function PostJournalDialog({
    open,
    onOpenChange,
    snapshotID,
    employeeName,
    monthDisplay,
    onPosted,
}: PostJournalDialogProps): React.ReactElement {
    const { data: journal, error, isLoading, mutate } = useSalarySnapshotJournal(
        open && snapshotID !== null ? snapshotID : undefined,
    )

    // Unticked utang components, by component index. Everything postable is
    // ticked by default.
    const [unticked, setUnticked] = useState<Set<number>>(new Set())
    const [posting, setPosting] = useState(false)

    const handleOpenChange = (next: boolean) => {
        if (posting) return
        if (!next) setUnticked(new Set())
        onOpenChange(next)
    }

    const firstPost = journal?.status === "none"
    const postableDebts = journal?.lines.filter((line) => line.kind === "debt" && line.postable) ?? []
    const tickedDebts = postableDebts.filter((line) => !unticked.has(line.componentIndex!))
    const retryCount = journal?.lines.filter((line) => line.entry && line.entry.status !== "posted").length ?? 0
    const count = firstPost ? 1 + tickedDebts.length : retryCount

    const handlePost = async () => {
        if (!journal || snapshotID === null || posting) return

        setPosting(true)
        try {
            const result = await postSalarySnapshotJournal(
                snapshotID,
                tickedDebts.map((line) => line.componentIndex!),
            )
            await mutate(result, { revalidate: false })

            if (result.status === "posted") {
                toast.success("Jurnal berhasil diposting")
                setUnticked(new Set())
                onOpenChange(false)
            } else {
                // The dialog stays open on the per-entry results.
                toast.error("Gagal memposting jurnal", {
                    description: describeFailures(result),
                })
            }
        } catch (err) {
            console.error("Failed to post snapshot journal:", err)
            toast.error("Gagal memposting jurnal", {
                description: err instanceof SalaryApiError ? err.message : "Server tidak dapat dihubungi. Silakan coba lagi.",
            })
            await mutate()
        } finally {
            setPosting(false)
            onPosted?.()
        }
    }

    const toggle = (index: number, ticked: boolean) => {
        const next = new Set(unticked)
        if (ticked) next.delete(index)
        else next.add(index)
        setUnticked(next)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {journal && !firstPost ? "Posting belum selesai" : "Posting ke Jurnal Keuangan Vmedis"}
                    </DialogTitle>
                    <DialogDescription>
                        {employeeName} · {monthDisplay}
                        {journal && (
                            <> · snapshot #{journal.snapshotID} dibuat {format(journal.snapshotCreatedAt, "d MMM yyyy HH:mm", { locale: id })}</>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {isLoading || (!journal && !error) ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-2 py-6">
                        <Loader2 className="h-4 w-4 animate-spin" /> Memuat jurnal...
                    </p>
                ) : error || !journal ? (
                    <Alert variant="destructive">
                        <AlertDescription>
                            Gagal memuat jurnal: {error instanceof Error ? error.message : "coba lagi"}
                        </AlertDescription>
                    </Alert>
                ) : firstPost ? (
                    <FirstPostBody journal={journal} unticked={unticked} onToggle={toggle} disabled={posting} />
                ) : (
                    <ResultsBody journal={journal} />
                )}

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={posting}>
                        {journal && !firstPost ? "Tutup" : "Batal"}
                    </Button>
                    {journal && (firstPost || journal.canPost) && (
                        <Button onClick={handlePost} disabled={posting || !journal.canPost || count === 0}>
                            {posting && <Loader2 className="animate-spin" />}
                            {posting ? "Memposting..." : firstPost ? `Posting ${count} Jurnal` : "Ulangi yang gagal"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface FirstPostBodyProps {
    journal: SalarySnapshotJournal
    unticked: Set<number>
    onToggle: (index: number, ticked: boolean) => void
    disabled: boolean
}

function FirstPostBody({ journal, unticked, onToggle, disabled }: FirstPostBodyProps): React.ReactElement {
    const salary = journal.lines[0]
    const debts = journal.lines.filter((line) => line.kind === "debt")
    const date = formatJournalDate(journal.journalDate)
    const count = 1 + debts.filter((line) => line.postable && !unticked.has(line.componentIndex!)).length
    // An earlier attempt that saved nothing in Vmedis.
    const lastError = journal.lines.find((line) => line.entry?.status === "failed")?.entry?.error

    return (
        <div className="flex flex-col gap-4">
            {lastError && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Posting sebelumnya gagal dan tidak ada jurnal yang dibuat di Vmedis: {lastError}
                    </AlertDescription>
                </Alert>
            )}

            {journal.blockedReason && (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {journal.blockedReason}
                        {journal.otherPostedSnapshotID !== null && (
                            <>
                                {" "}
                                <Link className="underline" href={`/salary/snapshots/${journal.otherPostedSnapshotID}`}>
                                    Lihat snapshot #{journal.otherPostedSnapshotID}
                                </Link>
                            </>
                        )}
                    </AlertDescription>
                </Alert>
            )}

            <section className="rounded-lg border p-4 flex flex-col gap-2" aria-labelledby="journal-salary-title">
                <h3 id="journal-salary-title" className="text-sm font-semibold">Jurnal gaji</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-4 gap-y-1.5 text-sm">
                    <dt className="text-muted-foreground">Tanggal</dt>
                    <dd>{date}</dd>
                    <dt className="text-muted-foreground">Akun Kredit</dt>
                    <dd>{accountLabel(salary.creditAccount)}</dd>
                    <dt className="text-muted-foreground">Akun Debit</dt>
                    <dd>{accountLabel(salary.debitAccount)}</dd>
                    <dt className="text-muted-foreground">Nominal (Total Tanpa Utang)</dt>
                    <dd className="font-semibold">{rupiah.format(salary.amount)}</dd>
                    <dt className="text-muted-foreground">Keterangan</dt>
                    <dd className="break-words">{salary.description}</dd>
                </dl>
            </section>

            <section className="rounded-lg border p-4 flex flex-col gap-2.5" aria-labelledby="journal-debts-title">
                <div>
                    <h3 id="journal-debts-title" className="text-sm font-semibold">Pelunasan utang</h3>
                    {debts.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Setiap utang yang dicentang dibuat jurnal: Kredit {accountLabel(debts[0].creditAccount)} → Debit{" "}
                            {accountLabel(debts[0].debitAccount)}, tanggal {date}.
                        </p>
                    )}
                </div>

                {debts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Tidak ada utang di snapshot ini.</p>
                ) : (
                    debts.map((line) => (
                        <DebtOption
                            key={line.componentIndex}
                            line={line}
                            ticked={line.postable && !unticked.has(line.componentIndex!)}
                            onToggle={onToggle}
                            disabled={disabled || !line.postable}
                        />
                    ))
                )}
            </section>

            <div className="rounded-lg bg-muted px-4 py-3 text-sm flex flex-col gap-1">
                <div>
                    <strong>{count}</strong> jurnal akan dibuat di Vmedis.
                </div>
                <div>Setelah diposting, snapshot ini tidak bisa dihapus.</div>
            </div>
        </div>
    )
}

interface DebtOptionProps {
    line: SalaryJournalLine
    ticked: boolean
    onToggle: (index: number, ticked: boolean) => void
    disabled: boolean
}

function DebtOption({ line, ticked, onToggle, disabled }: DebtOptionProps): React.ReactElement {
    const inputID = `journal-debt-${line.componentIndex}`

    return (
        <div className="rounded-lg border px-3 py-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-3 text-sm">
                <Checkbox
                    id={inputID}
                    checked={ticked}
                    onCheckedChange={(checked) => onToggle(line.componentIndex!, checked === true)}
                    disabled={disabled}
                />
                <label htmlFor={inputID} className="flex-1 cursor-pointer peer-disabled:cursor-not-allowed">
                    {line.componentDescription}
                </label>
                <span className="text-muted-foreground whitespace-nowrap">{rupiah.format(line.amount)}</span>
            </div>
            {line.warning && (
                <p className="text-xs text-orange-800 dark:text-orange-200 pl-7">{line.warning}</p>
            )}
        </div>
    )
}

function ResultsBody({ journal }: { journal: SalarySnapshotJournal }): React.ReactElement {
    const recorded = journal.lines.filter((line) => line.entry !== null)
    const notPosted = recorded.filter((line) => line.entry!.status !== "posted").length

    return (
        <div className="flex flex-col gap-4">
            {notPosted > 0 && (
                <Alert className="border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200">
                    <AlertDescription>
                        {notPosted} dari {recorded.length} jurnal belum berhasil dibuat di Vmedis. Jurnal yang sudah
                        berhasil tidak akan dibuat ulang.
                        {!journal.canPost && " Tunggu sebentar, lalu buka lagi dialog ini untuk mengulang."}
                    </AlertDescription>
                </Alert>
            )}

            <ul className="flex flex-col gap-2">
                {recorded.map((line) => {
                    const entry = line.entry!
                    return (
                        <li
                            key={`${line.kind}-${line.componentIndex ?? ""}`}
                            className="rounded-lg border px-3 py-2.5 flex items-start gap-3 text-sm"
                        >
                            <EntryStatusBadge entry={entry} />
                            <div className="flex-1 min-w-0">
                                <div>
                                    {lineTitle(line)} · {lineAccounts(line)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {entry.voucherNo ? `No. Bukti ${entry.voucherNo} · ` : ""}
                                    {rupiah.format(line.amount)}
                                </div>
                                {entry.error && entry.status !== "posted" && (
                                    <div className="text-xs text-destructive break-words">
                                        {isUncertain(entry) ? "Belum pasti tersimpan: " : ""}
                                        {entry.error}
                                    </div>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>

            <p className="text-sm text-muted-foreground">
                Status snapshot: <strong>{journal.status === "posted" ? "Sudah diposting" : "Gagal sebagian"}</strong>.
                Snapshot tidak bisa dihapus selama ada jurnal yang berhasil.
            </p>
        </div>
    )
}

function describeFailures(journal: SalarySnapshotJournal): string {
    const failed = journal.lines.filter((line) => line.entry && line.entry.status !== "posted")
    if (journal.status === "none") {
        return "Tidak ada jurnal yang dibuat di Vmedis. " + (failed[0]?.entry?.error ?? "")
    }
    return `${failed.length} jurnal belum berhasil. Lihat rinciannya di dialog.`
}
