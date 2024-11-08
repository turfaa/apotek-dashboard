import { ReloadIcon } from "@radix-ui/react-icons"

export default function Loading(): React.ReactElement {
    return (
        <div className="flex items-center gap-2">
            <ReloadIcon className="h-4 w-4 animate-spin" />
            <span>Sedang memuat...</span>
        </div>
    )
}
