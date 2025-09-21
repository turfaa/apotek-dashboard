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

interface AddExtraInfoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (title: string, description: string) => void
    title?: string
    description?: string
}

export function AddExtraInfoDialog({
    open,
    onOpenChange,
    onAdd,
    title = "Tambah Informasi Tambahan",
    description = "Tambahkan informasi tambahan baru untuk karyawan ini.",
}: AddExtraInfoDialogProps): React.ReactElement {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.title.trim() && formData.description.trim()) {
            onAdd(formData.title.trim(), formData.description.trim())
            resetForm()
            onOpenChange(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
        })
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm()
        }
        onOpenChange(open)
    }

    const isFormValid = formData.title.trim() && formData.description.trim()

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
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Contoh: Catatan Khusus"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Masukkan deskripsi informasi tambahan..."
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={!isFormValid}>
                            Tambah Informasi
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
