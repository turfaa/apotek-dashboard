"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/cui/components"
import { Form as FormType } from "@/cui/types"
import {
    getUpdateRejectedDrugForm,
    updateRejectedDrug,
} from "@/lib/api/rejected-drug"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FormSkeleton } from "./create-rejected-drug-dialog"

export interface EditRejectedDrugDialogProps {
    rejectedDrugId: string
}

export function EditRejectedDrugDialog({
    rejectedDrugId,
}: EditRejectedDrugDialogProps): React.ReactElement {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState<FormType | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!open) {
            setForm(null)
            return
        }

        let cancelled = false
        getUpdateRejectedDrugForm(Number(rejectedDrugId))
            .then((form) => {
                if (!cancelled) setForm(form)
            })
            .catch((error) => {
                toast.error("Gagal memuat formulir")
                console.error("Error fetching update form:", error)
            })

        return () => {
            cancelled = true
        }
    }, [open, rejectedDrugId])

    const handleSubmit = async (values: Record<string, string>) => {
        setIsSubmitting(true)
        try {
            await updateRejectedDrug(Number(rejectedDrugId), {
                drugName: values.drugName,
                resolution: values.resolution,
                resolutionNotes: values.resolutionNotes,
            })

            toast.success("Obat tertolak berhasil diperbarui")
            setOpen(false)
            router.refresh()
        } catch (error) {
            toast.error("Gagal memperbarui obat tertolak")
            console.error("Error updating rejected drug:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {form?.title ?? "Ubah Obat Tertolak"}
                    </DialogTitle>
                    <DialogDescription>
                        Perbarui data atau resolusi obat tertolak.
                    </DialogDescription>
                </DialogHeader>
                {form ? (
                    <Form
                        form={form}
                        disabled={isSubmitting}
                        onSubmit={handleSubmit}
                        footer={
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </DialogFooter>
                        }
                    />
                ) : (
                    <FormSkeleton />
                )}
            </DialogContent>
        </Dialog>
    )
}
