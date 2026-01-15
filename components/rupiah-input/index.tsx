"use client"

import * as React from "react"
import { maskitoTransform } from "@maskito/core"
import { maskitoNumberOptionsGenerator, maskitoParseNumber } from "@maskito/kit"
import { useMaskito } from "@maskito/react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const maskitoOptions = maskitoNumberOptionsGenerator({
    prefix: "Rp ",
    decimalSeparator: ",",
    thousandSeparator: ".",
    precision: 2,
    decimalZeroPadding: true,
})

export interface RupiahInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value?: string | number
    onChange?: (value: number) => void
}

const RupiahInput = React.forwardRef<HTMLInputElement, RupiahInputProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ className, value, onChange, onInput, ...props }, _) => {
        const rupiahMask = useMaskito({ options: maskitoOptions })

        const formattedValue =
            typeof value === "number"
                ? maskitoTransform(
                    value.toString().replace(".", ","),
                    maskitoOptions,
                )
                : value

        const handleInput = React.useCallback(
            (e: React.FormEvent<HTMLInputElement>) => {
                onInput?.(e)
                if (!onChange) return

                let amount = maskitoParseNumber(e.currentTarget.value, ",")
                if (isNaN(amount)) {
                    amount = 0
                }
                onChange(amount)
            },
            [onChange, onInput],
        )

        return (
            <Input
                type="text"
                inputMode="numeric"
                ref={rupiahMask}
                className={cn("font-mono", className)}
                value={formattedValue}
                onInput={handleInput}
                {...props}
            />
        )
    },
)
RupiahInput.displayName = "RupiahInput"

export { RupiahInput }
