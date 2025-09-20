"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { CardTitle } from "@/components/ui/card"

interface CollapsibleHeaderProps {
    children: React.ReactNode
}

export function CollapsibleHeader({ children }: CollapsibleHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center justify-between">
                <CardTitle>Ringkasan Pekerjaan</CardTitle>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                        {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
    )
}
