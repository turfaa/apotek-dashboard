"use client"

import { usePrintMode } from "@/lib/print-mode"
import { Title } from "@tremor/react"
import { id } from "date-fns/locale"
import moment from "moment/moment"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useTransition, useRef } from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarProps } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover"


export function DatePicker(props: CalendarProps): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const { push } = useRouter()
    const pathname: string = usePathname()
    const { isPrintMode } = usePrintMode()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const dateFromParams = searchParams.get("date")
    const date = dateFromParams ? new Date(dateFromParams) : new Date()
    const dateString = format(date, "PPP", { locale: id })

    const popOverRef = useRef<HTMLButtonElement | null>(null);

    if (isPrintMode) {
        return <Title>{dateString}</Title>
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
                    {dateString}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <PopoverClose ref={popOverRef} />
                <Calendar
                    {...props}
                    disabled={isPending}
                    autoFocus
                    mode="single"
                    locale={id}
                    selected={date}
                    onSelect={(date) => {
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

                        popOverRef.current?.click()
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
