import { SalaryExtraInfo } from "@/lib/api/salary"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteExtraInfoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    extraInfo: SalaryExtraInfo | null
    onConfirm: () => void
    title?: string
    description?: string
}

export function DeleteExtraInfoDialog({
    open,
    onOpenChange,
    extraInfo,
    onConfirm,
    title = "Hapus Informasi Tambahan",
    description = "Apakah Anda yakin ingin menghapus informasi tambahan ini? Tindakan ini tidak dapat dibatalkan.",
}: DeleteExtraInfoDialogProps): React.ReactElement {
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
                
                {extraInfo && (
                    <div className="py-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-medium mb-2">{extraInfo.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{extraInfo.description}</p>
                            <div className="text-xs text-muted-foreground">
                                Dibuat: {format(extraInfo.createdAt, "dd MMM yyyy 'pukul' HH:mm", { locale: id })}
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
