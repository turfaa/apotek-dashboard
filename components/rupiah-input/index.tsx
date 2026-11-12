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
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
})

export interface RupiahInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value?: string | number
    onChange?: (value: number) => void
}

const RupiahInput = React.forwardRef<HTMLInputElement, RupiahInputProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ className, value, onChange, onInput, onClick, onFocus, ...props }, _) => {
        const rupiahMask = useMaskito({ options: maskitoOptions })

        // A zero amount ("Rp 0,00") has its caret land after the decimals, where typing
        // is rejected. Select the whole text instead so typing replaces it.
        const selectAllIfZero = (input: HTMLInputElement) => {
            const amount = maskitoParseNumber(input.value, { decimalSeparator: "," })
            if (!amount) {
                input.select()
            }
        }

        const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
            onClick?.(e)
            selectAllIfZero(e.currentTarget)
        }

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            onFocus?.(e)
            selectAllIfZero(e.currentTarget)
        }

        const formattedValue =
            typeof value === "number"
                ? maskitoTransform(
                    value.toString().replace(".", ","),
                    maskitoOptions,
                )
                : value

        const handleInput = React.useCallback(
            (e: React.InputEvent<HTMLInputElement>) => {
                onInput?.(e)
                if (!onChange) return

                let amount = maskitoParseNumber(e.currentTarget.value, { decimalSeparator: "," })
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
                onClick={handleClick}
                onFocus={handleFocus}
                {...props}
            />
        )
    },
)
RupiahInput.displayName = "RupiahInput"

export { RupiahInput }
