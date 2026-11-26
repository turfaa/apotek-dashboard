"use client"

import { use, useState } from "react"
import { Employee } from "@/lib/api/employee"
import { SalarySnapshot, deleteSalarySnapshot } from "@/lib/api/salary"
import { useSalarySnapshotJournal } from "@/lib/api/hooks"
import { Session } from "next-auth"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, BookCheck, RotateCcw, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import { SalaryCard } from "../../components/salary-card"
import { usePrintMode } from "@/lib/print-mode"
import { SlipPdfButton } from "../slip-download"
import { DeleteSnapshotDialog } from "../delete-snapshot-dialog"
import { JournalSection, JournalStatusBadge } from "../journal"
import { PostJournalDialog } from "../post-journal-dialog"

interface SnapshotDetailClientProps {
    snapshotPromise: Promise<SalarySnapshot>
    employeesPromise: Promise<Employee[]>
    sessionPromise: Promise<Session | null>
}

export function SnapshotDetailClient({
    snapshotPromise,
    employeesPromise,
    sessionPromise,
}: SnapshotDetailClientProps): React.ReactElement {
    const snapshot = use(snapshotPromise)
    const employees = use(employeesPromise)
    const router = useRouter()
    const session = use(sessionPromise)
    const { isPrintMode } = usePrintMode(session?.user?.role)

    const [showPostDialog, setShowPostDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // The live journal status: the snapshot's is as of the page load.
    const { data: journal } = useSalarySnapshotJournal(isPrintMode ? undefined : snapshot.id)
    const journalStatus = journal?.status ?? snapshot.journalStatus

    const employee = employees.find(emp => emp.id === snapshot.employeeID)
    const employeeName = employee?.name || "Karyawan tidak ditemukan"
    const monthDate = new Date(snapshot.month + "-01")
    const monthDisplay = format(monthDate, "MMMM yyyy", { locale: id })

    const handleGoBack = () => {
        router.back()
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await deleteSalarySnapshot(snapshot.id)
            toast.success("Snapshot gaji berhasil dihapus")
            setShowDeleteDialog(false)
            router.push(`/salary/snapshots?month=${snapshot.month}`)
        } catch (error) {
            console.error("Failed to delete snapshot:", error)
            toast.error("Gagal menghapus snapshot gaji", {
                description: error instanceof Error ? error.message : undefined,
            })
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            {!isPrintMode && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-lg font-semibold">
                                Snapshot Gaji - {employeeName}
                            </h2>
                            <JournalStatusBadge status={journalStatus} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Dibuat pada {format(snapshot.createdAt, "dd MMM yyyy 'pukul' HH:mm", { locale: id })}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <SlipPdfButton snapshotID={snapshot.id} variant="label" />
                        {journalStatus !== "posted" && (
                            <Button onClick={() => setShowPostDialog(true)}>
                                {journalStatus === "partial" ? <RotateCcw /> : <BookCheck />}
                                {journalStatus === "partial" ? "Ulangi Posting" : "Posting ke Jurnal Vmedis"}
                            </Button>
                        )}
                        <DeleteButton
                            disabled={journalStatus !== "none"}
                            onClick={() => setShowDeleteDialog(true)}
                        />
                        <Button variant="outline" onClick={handleGoBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Daftar
                        </Button>
                    </div>
                </div>
            )}

            <SalaryCard
                salary={snapshot.salary}
                employeeName={employeeName}
                monthDisplay={monthDisplay}
            />

            {!isPrintMode && (
                <>
                    <JournalSection snapshotID={snapshot.id} />

                    <PostJournalDialog
                        open={showPostDialog}
                        onOpenChange={setShowPostDialog}
                        snapshotID={snapshot.id}
                        employeeName={employeeName}
                        monthDisplay={monthDisplay}
                    />

                    <DeleteSnapshotDialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                        snapshot={snapshot}
                        onConfirm={handleDelete}
                        deleting={deleting}
                    />
                </>
            )}
        </div>
    )
}

// "Hapus Snapshot", disabled with an explanation once the snapshot is (being)
// posted to the Vmedis journal.
function DeleteButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }): React.ReactElement {
    const button = (
        <Button variant="destructive" onClick={onClick} disabled={disabled}>
            <Trash2 />
            Hapus Snapshot
        </Button>
    )

    if (!disabled) return button

    const reason = "Snapshot yang sudah diposting ke Vmedis tidak bisa dihapus"
    return (
        <TooltipProvider>
            <Tooltip>
                {/* A disabled button gets no pointer events: the wrapper shows the tooltip. */}
                <TooltipTrigger asChild>
                    <span tabIndex={0} aria-label={reason}>
                        {button}
                    </span>
                </TooltipTrigger>
                <TooltipContent>{reason}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
