"use client"

import Anonymous from "@/app/anonymous.png"
import Logo from "@/app/icon.png"
import { Role } from "@/lib/api/auth"
import { useNavigation } from "@/lib/navigation"
import { usePrintMode } from "@/lib/print-mode"
import PrintButton from "@/components/print-button"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useState } from "react"

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
        <Disclosure as="nav" className="bg-white shadow-sm">
            {({ open }) => (
                <>
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
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                {rolesAllowedToPrint.includes(
                                    session?.user?.role ?? Role.GUEST,
                                ) && <PrintButton />}

                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                                            <span className="sr-only">
                                                Open user menu
                                            </span>
                                            <Image
                                                className="h-8 w-8 rounded-full"
                                                src={
                                                    session?.user?.image ||
                                                    Anonymous
                                                }
                                                height={32}
                                                width={32}
                                                alt={`${session?.user?.name || "placeholder"} avatar`}
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {session?.user ? (
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100"
                                                                    : "",
                                                                "flex w-full px-4 py-2 text-sm text-gray-700",
                                                            )}
                                                            onClick={() =>
                                                                signOut()
                                                            }
                                                        >
                                                            Sign out
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            ) : (
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100"
                                                                    : "",
                                                                "flex w-full px-4 py-2 text-sm text-gray-700",
                                                            )}
                                                            onClick={() =>
                                                                signIn("google")
                                                            }
                                                        >
                                                            Sign in
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            )}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                            <div className="-mr-2 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    {open ? (
                                        <XMarkIcon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Bars3Icon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 pt-2 pb-3">
                            {pages.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        pathname === item.href
                                            ? "bg-slate-50 border-slate-500 text-slate-700"
                                            : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                                        "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                                    )}
                                    aria-current={
                                        pathname === item.href
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 pb-3">
                            {session?.user ? (
                                <>
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="h-8 w-8 rounded-full"
                                                src={
                                                    session?.user?.image ??
                                                    "https://avatar.vercel.sh/leerob"
                                                }
                                                height={32}
                                                width={32}
                                                alt={`${session?.user?.name} avatar`}
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-800">
                                                {session?.user?.name ??
                                                    session?.user?.role ??
                                                    "User"}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                {session?.user?.email ??
                                                    "(no email)"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        <button
                                            onClick={() => signOut()}
                                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="mt-3 space-y-1">
                                    <button
                                        onClick={() => signIn("google")}
                                        className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}
