"use client"

import { usePrintMode } from "@/lib/print-mode"
import { DateRangePickerItem, DateRangePickerProps, Title, DateRangePicker as Underlying } from "@tremor/react"
import {
    startOfMonth,
    startOfToday,
    startOfYear,
    sub
} from "date-fns"
import { id } from "date-fns/locale"
import moment from "moment/moment"
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface DateRangePickerOption {
    value: string
    from: Date
    until: Date
}

const today = startOfToday()

const options: DateRangePickerOption[] = [
    {
        value: "Hari ini",
        from: today,
        until: today,
    },
    {
        value: "7 hari terakhir",
        from: sub(today, { days: 7 }),
        until: today,
    },
    {
        value: "30 hari terakhir",
        from: sub(today, { days: 30 }),
        until: today,
    },
    {
        value: "Sejak awal bulan hingga hari ini",
        from: startOfMonth(today),
        until: today,
    },
    {
        value: "Sejak awal tahun hingga hari ini",
        from: startOfYear(today),
        until: today,
    },
]

export function DateRangePicker(props: DateRangePickerProps): React.ReactElement {
    const { push } = useRouter()
    const pathname: string = usePathname()
    const { isPrintMode } = usePrintMode()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const fromFromParams = searchParams.get("from")
    const from = fromFromParams ? new Date(fromFromParams) : new Date()

    const untilFromParams = searchParams.get("until")
    const until = untilFromParams ? new Date(untilFromParams) : new Date()

    const [textValue, setTextValue] = useState(undefined as string | undefined)

    if (isPrintMode) {
        return <Title>{from.toLocaleDateString("id-ID")} - {until.toLocaleDateString("id-ID")}</Title>
    }

    return (
        <Underlying
            {...props}
            value={{ from: from, to: until, selectValue: textValue }}
            locale={id}
            enableClear={false}
            onValueChange={dateRange => {
                const params: URLSearchParams = new URLSearchParams(window.location.search)
                params.set("from", moment(dateRange.from ?? new Date()).format("YYYY-MM-DD"))
                params.set("until", moment(dateRange.to ?? new Date()).format("YYYY-MM-DD"))
                setTextValue(dateRange.selectValue)
                push(`${pathname}?${params.toString()}`)
            }}
        >
            {options.map(option => <DateRangePickerItem key={option.value} value={option.value} from={option.from} to={option.until} />)}
        </Underlying>
    )
}
