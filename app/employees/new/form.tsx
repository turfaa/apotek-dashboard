"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RupiahInput } from "@/components/rupiah-input"
import { createEmployee } from "@/lib/api/employee"
import { SalaryApiError } from "@/lib/api/salary"
import { toast } from "sonner"
import {
    BankAccountFields,
    bankAccountDefaults,
    bankAccountFields,
    refineBankAccount,
    saveBankAccount,
} from "../bank-account-fields"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Nama harus minimal 2 karakter.",
    }),
    shiftFee: z.number().positive({
        message: "Gaji per shift harus berupa angka positif.",
    }),
    ...bankAccountFields,
}).superRefine(refineBankAccount)

export function EmployeeForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            shiftFee: 0,
            ...bankAccountDefaults(null),
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let employeeID: number
        try {
            const employee = await createEmployee(values.name, values.shiftFee)
            employeeID = employee.id
        } catch (error) {
            toast.error("Gagal menambahkan karyawan")
            console.error(error)
            return
        }

        try {
            await saveBankAccount(employeeID, values, false)
            toast.success("Karyawan berhasil ditambahkan")
        } catch (error) {
            console.error(error)
            toast.error("Karyawan ditambahkan, tapi rekening bank gagal disimpan", {
                description: `${error instanceof SalaryApiError ? error.message : "Server tidak dapat dihubungi."} Isi lagi di halaman edit karyawan.`,
            })
            router.push(`/employees/${employeeID}/edit`)
            return
        }

        router.push("/employees")
        router.refresh()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan nama" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shiftFee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gaji per Shift</FormLabel>
                            <FormControl>
                                <RupiahInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    onFocus={(e) => e.currentTarget.select()}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <BankAccountFields />
                <div className="flex gap-4">
                    <Button type="submit" disabled={form.formState.isSubmitting}>Tambah Karyawan</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/employees")}
                    >
                        Batal
                    </Button>
                </div>
            </form>
        </Form>
    )
}
