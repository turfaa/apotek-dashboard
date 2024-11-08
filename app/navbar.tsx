"use client"

import Anonymous from "@/app/anonymous.png"
import Logo from "@/app/icon.png"
import { Role } from "@/lib/api/auth"
import { useNavigation } from "@/lib/navigation"
import { usePrintMode } from "@/lib/print-mode"
import PrintButton from "@/components/print-button"
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons"
import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetTitle,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const rolesAllowedToPrint = [Role.ADMIN, Role.STAFF]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
}

export default function Navbar({
    session,
}: {
    session?: Session | null
}): React.ReactElement {
    const { homepage, pages } = useNavigation(session?.user?.role)

    let pathname = usePathname()
    if (pathname === "/") pathname = `/${homepage}`

    const { isPrintMode, setPrintMode } = usePrintMode(
        session?.user?.role ?? Role.GUEST,
    )
    const [pageLoadCompleted, setPageLoadCompleted] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    useEffect(() => setPageLoadCompleted(true), [])

    useEffect(() => {
        if (isPrintMode && pageLoadCompleted) {
            window.print()
            setPrintMode(false)
        }
    }, [isPrintMode, setPrintMode, pageLoadCompleted])

    if (isPrintMode) {
        return <> </>
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Image
                                src={Logo}
                                height={40}
                                width={40}
                                alt="Logo"
                            />
                        </div>
                        <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                            {pages.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        pathname === item.href
                                            ? "border-slate-500 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                                    )}
                                    aria-current={
                                        pathname === item.href
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        {rolesAllowedToPrint.includes(
                            session?.user?.role ?? Role.GUEST,
                        ) && <PrintButton />}

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Image
                                    className="h-10 w-10 rounded-full"
                                    src={session?.user?.image || Anonymous}
                                    height={32}
                                    width={32}
                                    alt={`${session?.user?.name || "placeholder"} avatar`}
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {session?.user ? (
                                    <>
                                        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                                        <DropdownMenuLabel className="text-sm text-gray-500 font-normal mt-0 pt-0">{session?.user?.email}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => signOut()}>
                                            Sign out
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuLabel>Tamu</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => signIn("google")}>
                                            Sign in
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10">
                                    {isSheetOpen ? (
                                        <Cross1Icon className="h-6 w-6" />
                                    ) : (
                                        <HamburgerMenuIcon className="h-6 w-6" />
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetTitle>Menu</SheetTitle>
                                <SheetHeader>
                                    <div className="space-y-1 pt-2 pb-3">
                                        {pages.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    pathname === item.href
                                                        ? "bg-slate-50 border-slate-500 text-slate-700"
                                                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                                                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                                                )}
                                                onClick={() => setIsSheetOpen(false)}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 pb-3">
                                        {session?.user ? (
                                            <>
                                                <div className="flex items-center px-4">
                                                    <div className="flex-shrink-0">
                                                        <Image
                                                            className="h-8 w-8 rounded-full"
                                                            src={session?.user?.image ?? Anonymous}
                                                            height={32}
                                                            width={32}
                                                            alt={`${session?.user?.name} avatar`}
                                                        />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-base font-medium text-gray-800">
                                                            {session?.user?.name ?? session?.user?.role ?? "User"}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-500">
                                                            {session?.user?.email ?? "(no email)"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 space-y-1">
                                                    <Button
                                                        onClick={() => signOut()}
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                    >
                                                        Sign out
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mt-3 space-y-1">
                                                <Button
                                                    onClick={() => signIn("google")}
                                                    variant="ghost"
                                                    className="w-full justify-start"
                                                >
                                                    Sign in
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
