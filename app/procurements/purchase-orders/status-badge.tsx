import { Badge } from "@/components/ui/badge"

export function StatusBadge({ cancelled }: { cancelled: boolean }): React.ReactElement {
    return cancelled ? (
        <Badge className="border-transparent bg-red-100 text-red-800 shadow-none hover:bg-red-100 dark:bg-red-950 dark:text-red-200">
            Dibatalkan
        </Badge>
    ) : (
        <Badge variant="outline">Aktif</Badge>
    )
}
