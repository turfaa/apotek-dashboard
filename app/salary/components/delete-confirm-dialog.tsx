import { SalaryStaticComponent, SalaryAdditionalComponent } from "@/lib/api/salary"
import { rupiah } from "@/lib/rupiah"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    component: (SalaryStaticComponent | SalaryAdditionalComponent) | null
    onConfirm: () => void
    title?: string
    description?: string
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    component,
    onConfirm,
    title = "Hapus Komponen Gaji",
    description = "Apakah Anda yakin ingin menghapus komponen gaji ini? Tindakan ini tidak dapat dibatalkan.",
}: DeleteConfirmDialogProps): React.ReactElement {
    const handleConfirm = () => {
        onConfirm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                
                {component && (
                    <div className="py-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-medium mb-2">{component.description}</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div>Jumlah: {component.multiplier.toLocaleString("id-ID")}</div>
                                <div>Fee / -Penalti: {rupiah.format(component.amount)}</div>
                                <div>Total: {rupiah.format(component.total)}</div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
