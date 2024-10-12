import { Input } from "@/components/ui/input"

export function SearchButtonFallback(): React.ReactElement {
    return <Input placeholder="Cari obat..." disabled={true} />
}
