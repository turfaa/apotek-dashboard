"use client"

import { useCallback } from "react"
import { Session } from "next-auth"
import { toast } from "sonner"
import {
    createSalaryAdditionalComponent,
    createSalaryExtraInfo,
    bulkCreateSalaryAdditionalComponents,
} from "@/lib/api/salary"

interface UseSalaryMutationsParams {
    employeeID: number | string | undefined
    month: string | undefined
    session: Session | null
    onSuccess?: () => void | Promise<void>
}

export function useSalaryMutations({
    employeeID,
    month,
    session,
    onSuccess,
}: UseSalaryMutationsParams) {
    const handleAddAdditionalComponent = useCallback(
        async (
            description: string,
            amount: number,
            multiplier: number
        ) => {
            if (!employeeID || !month || !session) {
                toast.error("Pilih karyawan dan bulan terlebih dahulu")
                return
            }

            try {
                await createSalaryAdditionalComponent(
                    typeof employeeID === "string"
                        ? parseInt(employeeID)
                        : employeeID,
                    month,
                    description,
                    amount,
                    multiplier,
                    session
                )
                toast.success("Komponen gaji tambahan berhasil ditambahkan")
                await onSuccess?.()
            } catch (error) {
                console.error("Failed to create additional component:", error)
                toast.error("Gagal menambahkan komponen gaji tambahan")
            }
        },
        [employeeID, month, session, onSuccess]
    )

    const handleAddExtraInfo = useCallback(
        async (title: string, description: string) => {
            if (!employeeID || !month || !session) {
                toast.error("Pilih karyawan dan bulan terlebih dahulu")
                return
            }

            try {
                await createSalaryExtraInfo(
                    typeof employeeID === "string"
                        ? parseInt(employeeID)
                        : employeeID,
                    month,
                    title,
                    description,
                    session
                )
                toast.success("Informasi tambahan berhasil ditambahkan")
                await onSuccess?.()
            } catch (error) {
                console.error("Failed to create extra info:", error)
                toast.error("Gagal menambahkan informasi tambahan")
            }
        },
        [employeeID, month, session, onSuccess]
    )

    const handleBulkAddAdditionalComponent = useCallback(
        async (
            employeeIDs: number[],
            description: string,
            amount: number,
            multiplier: number
        ) => {
            if (!month || !session) {
                toast.error("Pilih bulan terlebih dahulu")
                return
            }

            if (employeeIDs.length === 0) {
                toast.error("Pilih minimal satu karyawan")
                return
            }

            try {
                await bulkCreateSalaryAdditionalComponents(
                    month,
                    employeeIDs,
                    description,
                    amount,
                    multiplier,
                    session
                )
                toast.success(
                    `Komponen gaji tambahan berhasil ditambahkan untuk ${employeeIDs.length} karyawan`
                )
                await onSuccess?.()
            } catch (error) {
                console.error("Failed to bulk create additional components:", error)
                toast.error("Gagal menambahkan komponen gaji tambahan secara massal")
            }
        },
        [month, session, onSuccess]
    )

    return {
        handleAddAdditionalComponent,
        handleAddExtraInfo,
        handleBulkAddAdditionalComponent,
    }
}

