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
}

export function AddComponentDialog({
    open,
    onOpenChange,
    onAdd,
}: AddComponentDialogProps): React.ReactElement {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(0)
    const [multiplier, setMultiplier] = useState(1)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (description.trim() && amount > 0 && multiplier > 0) {
            onAdd(description.trim(), amount, multiplier)
            setDescription("")
            setAmount(0)
            setMultiplier(1)
        }
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Reset form when closing
            setDescription("")
            setAmount(0)
            setMultiplier(1)
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Komponen Gaji Statis</DialogTitle>
                    <DialogDescription>
                        Tambahkan komponen gaji statis baru untuk karyawan ini.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                value={multiplier}
                                onChange={(e) => setMultiplier(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Fee / (Penalti)</Label>
                            <RupiahInput
                                id="amount"
                                value={amount}
                                onChange={setAmount}
                                placeholder="Masukkan jumlah dalam rupiah"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={!description.trim() || amount <= 0 || multiplier <= 0}>
                            Tambah Komponen
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
