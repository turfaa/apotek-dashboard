import { InnerNavbar } from "./navbar"

export default function NavbarFallback(): React.ReactElement {
    return (
        <InnerNavbar session={null} />
    )
}
