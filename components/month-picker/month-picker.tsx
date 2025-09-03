"use client"

import { usePrintMode } from "@/lib/print-mode"
import { Title } from "@/components/typography"
import { id } from "date-fns/locale"
import moment from "moment/moment"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useTransition, useRef, useEffect } from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MonthPicker as MonthPickerComponent, MonthCalProps } from "@/components/ui/monthpicker"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover"

export function MonthPicker(props: MonthCalProps): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const { push } = useRouter()
    const pathname: string = usePathname()
    const { isPrintMode } = usePrintMode()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const monthFromParams = searchParams.get("month")
    // Default to previous month if no month parameter
    const defaultMonth = new Date()
    defaultMonth.setMonth(defaultMonth.getMonth() - 1)
    const selectedMonth = monthFromParams ? new Date(monthFromParams) : defaultMonth
    const monthString = format(selectedMonth, "MMMM yyyy", { locale: id })

    const popOverRef = useRef<HTMLButtonElement | null>(null)

    // Set URL parameter if using default month
    useEffect(() => {
        if (!monthFromParams) {
            const params = new URLSearchParams(window.location.search)
            params.set("month", moment(defaultMonth).format("YYYY-MM"))
            startTransition(() => {
                push(`${pathname}?${params.toString()}`)
            })
        }
    }, [monthFromParams, defaultMonth, pathname, push, startTransition])

    if (isPrintMode) {
        return <Title>{monthString}</Title>
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={"w-[240px] justify-start text-left font-normal"}
                    disabled={isPending}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {monthString}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <PopoverClose ref={popOverRef} />
                <MonthPickerComponent
                    {...props}
                    selectedMonth={selectedMonth}
                    onMonthSelect={(month) => {
                        const params: URLSearchParams = new URLSearchParams(
                            window.location.search,
                        )
                        params.set(
                            "month",
                            moment(month).format("YYYY-MM"),
                        )

                        startTransition(() => {
                            push(`${pathname}?${params.toString()}`)
                        })

                        popOverRef.current?.click()
                    }}
                    callbacks={{
                        yearLabel: (year: number) => year.toString(),
                        monthLabel: (month: { number: number; name: string }) => month.name
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
