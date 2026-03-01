"use client"

import { use, useState } from "react"
import {
    AttendanceTypeQuotaPage,
    EmployeeAttendanceQuota,
    QuotaAuditLog,
    setEmployeeAttendanceQuota,
} from "@/lib/api/attendance"
import { Employee } from "@/lib/api/employee"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface QuotasPageClientProps {
    quotasPromise: Promise<AttendanceTypeQuotaPage[]>
    employeesPromise: Promise<Employee[]>
    auditLogsPromise: Promise<QuotaAuditLog[]>
}

const reasonLabels: Record<string, string> = {
    manual_set: "Set Manual",
    attendance_deduction: "Potongan Kehadiran",
    attendance_restoration: "Pemulihan Kehadiran",
}

export function QuotasPageClient({
    quotasPromise,
    employeesPromise,
    auditLogsPromise,
}: QuotasPageClientProps) {
    const quotaPages = use(quotasPromise)
    const employees = use(employeesPromise)
    const auditLogs = use(auditLogsPromise)

    const employeeMap = new Map(employees.map((e) => [e.id, e]))

    if (quotaPages.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-muted-foreground text-center">
                        Belum ada jenis kehadiran yang menggunakan kuota. Aktifkan
                        kuota pada jenis kehadiran terlebih dahulu.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Tabs defaultValue="quotas">
            <TabsList>
                <TabsTrigger value="quotas">Kuota</TabsTrigger>
                <TabsTrigger value="audit-logs">Riwayat Perubahan</TabsTrigger>
            </TabsList>

            <TabsContent value="quotas" className="space-y-6">
                {quotaPages.map((page) => (
                    <QuotaCard
                        key={page.attendanceType.id}
                        page={page}
                        employeeMap={employeeMap}
                    />
                ))}
            </TabsContent>

            <TabsContent value="audit-logs">
                <AuditLogTable
                    auditLogs={auditLogs}
                    employeeMap={employeeMap}
                />
            </TabsContent>
        </Tabs>
    )
}

interface QuotaCardProps {
    page: AttendanceTypeQuotaPage
    employeeMap: Map<number, Employee>
}

function QuotaCard({ page, employeeMap }: QuotaCardProps) {
    const router = useRouter()
    const [editingQuota, setEditingQuota] =
        useState<EmployeeAttendanceQuota | null>(null)
    const [newQuotaValue, setNewQuotaValue] = useState("")
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        if (!editingQuota) return

        const value = parseInt(newQuotaValue, 10)
        if (isNaN(value) || value < 0) {
            toast.error("Kuota harus berupa angka non-negatif")
            return
        }

        setSaving(true)
        try {
            await setEmployeeAttendanceQuota(
                editingQuota.employeeID,
                page.attendanceType.id,
                value,
            )
            toast.success("Kuota berhasil diperbarui")
            setEditingQuota(null)
            router.refresh()
        } catch (error) {
            toast.error("Gagal memperbarui kuota")
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{page.attendanceType.name}</CardTitle>
                    <CardDescription>
                        Kelola kuota untuk jenis kehadiran ini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {page.employeeQuotas.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                            Belum ada kuota yang ditetapkan untuk karyawan.
                        </p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Karyawan</TableHead>
                                        <TableHead className="text-right">
                                            Sisa Kuota
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {page.employeeQuotas.map((quota) => {
                                        const employee = employeeMap.get(
                                            quota.employeeID,
                                        )
                                        return (
                                            <TableRow key={quota.id}>
                                                <TableCell>
                                                    {employee?.name ??
                                                        `Karyawan #${quota.employeeID}`}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant={
                                                            quota.remainingQuota >
                                                            0
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                    >
                                                        {quota.remainingQuota}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingQuota(
                                                                quota,
                                                            )
                                                            setNewQuotaValue(
                                                                quota.remainingQuota.toString(),
                                                            )
                                                        }}
                                                    >
                                                        Ubah
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={editingQuota !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingQuota(null)
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Kuota</DialogTitle>
                        <DialogDescription>
                            Ubah sisa kuota{" "}
                            <strong>{page.attendanceType.name}</strong> untuk{" "}
                            <strong>
                                {editingQuota
                                    ? (employeeMap.get(
                                          editingQuota.employeeID,
                                      )?.name ??
                                      `Karyawan #${editingQuota.employeeID}`)
                                    : ""}
                            </strong>
                            .
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label
                            htmlFor="quota-input"
                            className="text-sm font-medium mb-2 block"
                        >
                            Sisa Kuota
                        </label>
                        <Input
                            id="quota-input"
                            type="number"
                            min={0}
                            value={newQuotaValue}
                            onChange={(e) => setNewQuotaValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave()
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditingQuota(null)}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

interface AuditLogTableProps {
    auditLogs: QuotaAuditLog[]
    employeeMap: Map<number, Employee>
}

function AuditLogTable({ auditLogs, employeeMap }: AuditLogTableProps) {
    if (auditLogs.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-muted-foreground text-center">
                        Belum ada riwayat perubahan kuota.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Perubahan Kuota</CardTitle>
                <CardDescription>
                    Log perubahan kuota kehadiran karyawan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Karyawan</TableHead>
                                <TableHead>Jenis Kehadiran</TableHead>
                                <TableHead className="text-right">
                                    Kuota Sebelumnya
                                </TableHead>
                                <TableHead className="text-right">
                                    Kuota Baru
                                </TableHead>
                                <TableHead>Alasan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {auditLogs.map((log) => {
                                const employee = employeeMap.get(
                                    log.employeeID,
                                )
                                return (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(
                                                log.createdAt,
                                            ).toLocaleString("id-ID")}
                                        </TableCell>
                                        <TableCell>
                                            {employee?.name ??
                                                `Karyawan #${log.employeeID}`}
                                        </TableCell>
                                        <TableCell>
                                            {log.attendanceType.name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {log.previousQuota}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {log.newQuota}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {reasonLabels[log.reason] ??
                                                    log.reason}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
