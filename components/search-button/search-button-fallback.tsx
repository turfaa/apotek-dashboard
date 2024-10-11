import { TextInput } from "@tremor/react"

export function SearchButtonFallback(): React.ReactElement {
    return <TextInput placeholder="Cari obat..." disabled={true} />
}
