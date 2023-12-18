import Image from "next/image"
import Logo from "@/app/icon.png"

export default function NavbarFallback(): React.ReactElement {
    return (
        <nav className="bg-white shadow">
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
                    </div>
                </div>
            </div>
        </nav>
    )
}
