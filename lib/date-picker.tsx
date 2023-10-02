"use client"

import {DatePicker as Underlying, DatePickerProps} from "@tremor/react"
import {usePathname, useRouter} from "next/navigation"
import moment from "moment/moment"
import {id} from "date-fns/locale"

export function DatePicker(props: DatePickerProps): React.ReactElement {
    const {push} = useRouter()
    const pathname: string = usePathname()

    return (
        <Underlying
            {...props}
            locale={id}
            onValueChange={date => {
                const params: URLSearchParams = new URLSearchParams(window.location.search)
                params.set("date", moment(date ?? new Date()).format("YYYY-MM-DD"))
                push(`${pathname}?${params.toString()}`)
            }}
        />
    )
}