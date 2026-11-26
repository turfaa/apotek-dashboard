"use client"

import * as React from "react"
import { maskitoTransform } from "@maskito/core"
import { maskitoNumberOptionsGenerator, maskitoParseNumber } from "@maskito/kit"
import { useMaskito } from "@maskito/react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const numberParams = {
    prefix: "Rp ",
    decimalSeparator: ",",
    thousandSeparator: ".",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
}

const maskitoOptions = maskitoNumberOptionsGenerator(numberParams)

// The mask writes negatives with a Unicode minus ("Rp −5.000,00"), so parse with
// the same params as the mask. Text with no digits yet (such as "Rp −") is 0.
function parseAmount(text: string): number {
    const amount = maskitoParseNumber(text, numberParams)
    return isNaN(amount) ? 0 : amount
}

function formatValue(value: string | number | undefined): string {
    if (typeof value === "number") {
        return maskitoTransform(value.toString().replace(".", ","), maskitoOptions)
    }
    return value ?? ""
}

export interface RupiahInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value?: string | number
    onChange?: (value: number) => void
}

const RupiahInput = React.forwardRef<HTMLInputElement, RupiahInputProps>(
    // oxlint-disable-next-line no-unused-vars
    ({ className, value, onChange, onInput, onClick, onFocus, ...props }, _) => {
        const rupiahMask = useMaskito({ options: maskitoOptions })

        // Keep the typed text so a lone minus sign ("Rp −") survives until digits
        // follow it. Re-format from `value` only when the parent changes it to an
        // amount that differs from what is typed.
        const [text, setText] = React.useState(() => formatValue(value))
        const [prevValue, setPrevValue] = React.useState(value)
        if (value !== prevValue) {
            setPrevValue(value)
            if (typeof value !== "number" || parseAmount(text) !== value) {
                setText(formatValue(value))
            }
        }

        // A zero amount ("Rp 0,00") has its caret land after the decimals, where typing
        // is rejected. Select the whole text instead so typing replaces it.
        const selectAllIfZero = (input: HTMLInputElement) => {
            if (!parseAmount(input.value)) {
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

        const handleInput = (e: React.InputEvent<HTMLInputElement>) => {
            onInput?.(e)
            const newText = e.currentTarget.value
            setText(newText)
            onChange?.(parseAmount(newText))
        }

        return (
            <Input
                type="text"
                inputMode="numeric"
                ref={rupiahMask}
                className={cn("font-mono", className)}
                value={text}
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
