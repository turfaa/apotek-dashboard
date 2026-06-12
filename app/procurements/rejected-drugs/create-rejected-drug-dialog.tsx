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
import { Skeleton } from "@/components/ui/skeleton"
import { Form } from "@/cui/components"
import { Form as FormType } from "@/cui/types"
import {
    createRejectedDrug,
    getCreateRejectedDrugForm,
} from "@/lib/api/rejected-drug"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function CreateRejectedDrugDialog(): React.ReactElement {
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
        getCreateRejectedDrugForm()
            .then((form) => {
                if (!cancelled) setForm(form)
            })
            .catch((error) => {
                toast.error("Gagal memuat formulir")
                console.error("Error fetching create form:", error)
            })

        return () => {
            cancelled = true
        }
    }, [open])

    const handleSubmit = async (values: Record<string, string>) => {
        setIsSubmitting(true)
        try {
            await createRejectedDrug({ drugName: values.drugName })

            toast.success("Obat tertolak berhasil dicatat")
            setOpen(false)
            router.refresh()
        } catch (error) {
            toast.error("Gagal mencatat obat tertolak")
            console.error("Error creating rejected drug:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Catat Obat Tertolak
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {form?.title ?? "Catat Obat Tertolak"}
                    </DialogTitle>
                    <DialogDescription>
                        Catat obat yang dicari pelanggan tapi belum tersedia.
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

export function FormSkeleton(): React.ReactElement {
    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
            </div>
            <div className="grid gap-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-9 w-full" />
            </div>
        </div>
    )
}
