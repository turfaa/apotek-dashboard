"use client"

import { usePrintMode } from "@/lib/print-mode"
import { Title } from "@/components/typography"
import {
    startOfMonth,
    startOfToday,
    startOfYear,
    startOfYesterday,
    sub,
    format,
} from "date-fns"
import { id } from "date-fns/locale"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useState, useTransition } from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarProps } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DateRange } from "react-day-picker"

interface DateRangePickerOption {
    value: string
    from: Date
    until: Date
}

const today = startOfToday()
const yesterday = startOfYesterday()

const options: DateRangePickerOption[] = [
    {
        value: "Hari ini",
        from: today,
        until: today,
    },
    {
        value: "Kemarin",
        from: yesterday,
        until: yesterday,
    },
    {
        value: "7 hari terakhir",
        from: sub(today, { days: 6 }),
        until: today,
    },
    {
        value: "30 hari terakhir",
        from: sub(today, { days: 29 }),
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
    {
        value: "Bulan lalu",
        from: sub(startOfMonth(today), { months: 1 }),
        until: sub(startOfMonth(today), { days: 1 }),
    },
]

export function DateRangePicker(
    props: CalendarProps
): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const { push } = useRouter()
    const pathname: string = usePathname()
    const { isPrintMode } = usePrintMode()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const fromFromParams = searchParams.get("from")
    const from = fromFromParams ? new Date(fromFromParams) : new Date()

    const untilFromParams = searchParams.get("until")
    const until = untilFromParams ? new Date(untilFromParams) : new Date()

    const [date, setDate] = useState<DateRange | undefined>({
        from,
        to: until,
    })

    if (isPrintMode) {
        return (
            <Title>
                {from.toLocaleDateString("id-ID")} -{" "}
                {until.toLocaleDateString("id-ID")}
            </Title>
        )
    }

    return (
        <div className="grid gap-2">
            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className="w-[300px] justify-start text-left font-normal"
                            disabled={isPending}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to && date.to.toDateString() !== date.from.toDateString() ? (
                                    <>
                                        {format(date.from, "PPP", { locale: id })} -{" "}
                                        {format(date.to, "PPP", { locale: id })}
                                    </>
                                ) : (
                                    format(date.from, "PPP", { locale: id })
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            {...props}
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(newDate) => {
                                if (!newDate?.from) return
                                setDate(newDate)

                                const params = new URLSearchParams(window.location.search)
                                params.set(
                                    "from",
                                    format(newDate.from, "yyyy-MM-dd")
                                )
                                if (newDate.to) {
                                    params.set(
                                        "until",
                                        format(newDate.to, "yyyy-MM-dd")
                                    )
                                } else {
                                    params.set(
                                        "until",
                                        format(newDate.from, "yyyy-MM-dd")
                                    )
                                }

                                startTransition(() => {
                                    push(`${pathname}?${params.toString()}`)
                                })
                            }}
                            locale={id}
                        />
                    </PopoverContent>
                </Popover>

                <Select
                    onValueChange={(value) => {
                        const option = options.find(opt => opt.value === value)
                        if (!option) return

                        const newDate = {
                            from: option.from,
                            to: option.until,
                        }
                        setDate(newDate)

                        const params = new URLSearchParams(window.location.search)
                        params.set(
                            "from",
                            format(option.from, "yyyy-MM-dd")
                        )
                        params.set(
                            "until",
                            format(option.until, "yyyy-MM-dd")
                        )

                        startTransition(() => {
                            push(`${pathname}?${params.toString()}`)
                        })
                    }}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Pilih rentang waktu" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
