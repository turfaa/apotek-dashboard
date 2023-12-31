"use client"

import { usePrintMode } from "@/lib/print-mode"
import { DatePickerProps, Title, DatePicker as Underlying } from "@tremor/react"
import { id } from "date-fns/locale"
import moment from "moment/moment"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useTransition } from "react"

export function DatePicker(props: DatePickerProps): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const { push } = useRouter()
    const pathname: string = usePathname()
    const { isPrintMode } = usePrintMode()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const dateFromParams = searchParams.get("date")
    const date = dateFromParams ? new Date(dateFromParams) : new Date()

    if (isPrintMode) {
        return <Title>{date.toLocaleDateString("id-ID")}</Title>
    }

    return (
        <Underlying
            {...props}
            disabled={isPending}
            value={date}
            locale={id}
            enableClear={false}
            onValueChange={(date) => {
                const params: URLSearchParams = new URLSearchParams(
                    window.location.search,
                )
                params.set(
                    "date",
                    moment(date ?? new Date()).format("YYYY-MM-DD"),
                )

                startTransition(() => {
                    push(`${pathname}?${params.toString()}`)
                })
            }}
        />
    )
}
