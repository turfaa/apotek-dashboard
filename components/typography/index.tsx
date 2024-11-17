import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface TypographyProps {
    children: ReactNode
    className?: string
}

export function Title({ children, className }: TypographyProps) {
    return (
        <h3
            className={cn(
                "text-lg font-medium text-foreground",
                className
            )}
        >
            {children}
        </h3>
    )
}

export function Subtitle({ children, className }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-sm text-muted-foreground",
                className
            )}
        >
            {children}
        </p>
    )
}

export function Text({ children, className }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-sm text-foreground",
                className
            )}
        >
            {children}
        </p>
    )
}

export function Bold({ children, className }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-base font-bold text-foreground",
                className
            )}
        >
            {children}
        </p>
    )
}

export function Metric({ children, className }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-3xl font-semibold tracking-tight text-foreground",
                className
            )}
        >
            {children}
        </p>
    )
}
