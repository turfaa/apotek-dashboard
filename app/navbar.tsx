'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {usePrintMode} from '@/lib/print-mode'
import Image from 'next/image';
import Logo from './logo.svg'

interface NavigationItem {
    name: string
    href: string
}

const navigation: NavigationItem[] = [
    {name: 'Dashboard', href: '/'},
    {name: 'Pembelian', href: '/procurement'}
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar(): React.ReactElement {
    const pathname = usePathname()
    const {isPrintMode} = usePrintMode()

    if (isPrintMode) {
        return (<> </>)
    }

    return (
        <nav className="bg-white shadow-sm">
            <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Image src={Logo} alt="Aulia Farma Logo" width={40} height={40}/>
                            </div>
                            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            pathname === item.href
                                                ? 'border-slate-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                        )}
                                        aria-current={pathname === item.href ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </nav>
    )
}