import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface TypographyProps {
    children: ReactNode
    className?: string
}

export function Title({ children, className }: TypographyProps) {
    return (
        <h2
            className={cn(
                "text-3xl font-bold tracking-tight",
                className
            )}
        >
            {children}
        </h2>
    )
}