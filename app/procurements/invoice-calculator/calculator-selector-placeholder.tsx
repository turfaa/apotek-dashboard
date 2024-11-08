import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function CalculatorSelectorPlaceholder(): React.ReactElement {
    return (
        <Select disabled>
            <SelectTrigger>
                <SelectValue placeholder="Pilih supplier..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="fake">Fake Supplier</SelectItem>
            </SelectContent>
        </Select>
    )
}
