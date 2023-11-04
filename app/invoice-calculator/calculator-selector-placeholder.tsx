import { SearchSelect, SearchSelectItem } from "@tremor/react"

export default function CalculatorSelectorPlaceholder(): React.ReactElement {
    return (
        <SearchSelect placeholder="Pilih supplier..." disabled>
            <SearchSelectItem value="">
                Fake Supplier
            </SearchSelectItem>
        </SearchSelect>
    )
}