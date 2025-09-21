"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RupiahInput } from "@/components/rupiah-input"

interface AddComponentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (description: string, amount: number, multiplier: number) => void
    title?: string
    description?: string
}

export function AddComponentDialog({
    open,
    onOpenChange,
    onAdd,
    title = "Tambah Komponen Gaji",
    description = "Tambahkan komponen gaji baru untuk karyawan ini.",
}: AddComponentDialogProps): React.ReactElement {
    const [formData, setFormData] = useState({
        description: "",
        amount: 0,
        multiplier: 1,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.description.trim() && formData.amount > 0 && formData.multiplier > 0) {
            onAdd(formData.description.trim(), formData.amount, formData.multiplier)
            resetForm()
            onOpenChange(false)
        }
    }

    const resetForm = () => {
        setFormData({
            description: "",
            amount: 0,
            multiplier: 1,
        })
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm()
        }
        onOpenChange(open)
    }

    const isFormValid = formData.description.trim() && formData.amount > 0 && formData.multiplier > 0

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Contoh: Tunjangan Transport"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="multiplier">Jumlah</Label>
                            <Input
                                id="multiplier"
                                type="number"
                                min="1"
                                step="1"
                                value={formData.multiplier}
                                onChange={(e) => setFormData(prev => ({ ...prev, multiplier: Number(e.target.value) }))}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Fee / (Penalti)</Label>
                            <RupiahInput
                                id="amount"
                                value={formData.amount}
                                onChange={(amount) => setFormData(prev => ({ ...prev, amount }))}
                                placeholder="Masukkan jumlah dalam rupiah"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={!isFormValid}>
                            Tambah Komponen
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
