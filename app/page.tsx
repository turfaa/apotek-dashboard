import {Title} from "@tremor/react"
import ClientSide from "@/app/client"


export default function Home(): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title>Ringkasan Harian</Title>
            <ClientSide/>
        </main>
    )
}
