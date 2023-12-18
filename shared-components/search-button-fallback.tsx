import { TextInput } from "@tremor/react"

export default function SearchButtonFallback(): React.ReactElement {
    return <TextInput placeholder="Cari obat..." disabled={true} />
}
