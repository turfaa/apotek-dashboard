import { Role } from "@/lib/api/auth"
import { requireRole } from "@/lib/require-role"
import { redirect } from "next/navigation"

export default async function SalaryPage(): Promise<never> {
    await requireRole([Role.ADMIN])
    redirect("/salary/calculator")
}