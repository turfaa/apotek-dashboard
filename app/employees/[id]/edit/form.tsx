"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RupiahInput } from "@/components/rupiah-input"
import { Employee, updateEmployee } from "@/lib/api/employee"
import { BankAccount, SalaryApiError } from "@/lib/api/salary"
import { toast } from "sonner"
import {
    BankAccountFields,
    bankAccountDefaults,
    bankAccountFields,
    refineBankAccount,
    saveBankAccount,
} from "../../bank-account-fields"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Nama harus minimal 2 karakter.",
    }),
    shiftFee: z.number().positive({
        message: "Gaji per shift harus berupa angka positif.",
    }),
    showInAttendances: z.boolean(),
    isActive: z.boolean(),
    ...bankAccountFields,
}).superRefine(refineBankAccount)

interface EditEmployeeFormProps {
    employee: Employee
    // The employee's bank account for salary transfers, null when none.
    bankAccount: BankAccount | null
}

export function EditEmployeeForm({ employee, bankAccount }: EditEmployeeFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: employee.name,
            shiftFee: employee.shiftFee,
            showInAttendances: employee.showInAttendances,
            isActive: employee.isActive,
            ...bankAccountDefaults(bankAccount),
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateEmployee(
                employee.id,
                values.name,
                values.shiftFee,
                values.showInAttendances,
                values.isActive,
            )
        } catch (error) {
            toast.error("Gagal memperbarui data karyawan")
            console.error(error)
            return
        }

        try {
            await saveBankAccount(employee.id, values, bankAccount !== null)
        } catch (error) {
            console.error(error)
            toast.error("Data karyawan tersimpan, tapi rekening bank gagal disimpan", {
                description: error instanceof SalaryApiError ? error.message : "Server tidak dapat dihubungi. Silakan coba lagi.",
            })
            return
        }

        toast.success("Data karyawan berhasil diperbarui")
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
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Aktif
                                </FormLabel>
                                <FormDescription>
                                    Nonaktifkan jika karyawan ini sudah tidak
                                    bekerja lagi. Karyawan nonaktif tidak bisa
                                    dipilih di halaman lain selain kehadiran.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="showInAttendances"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Tampilkan di Kehadiran
                                </FormLabel>
                                <FormDescription>
                                    Aktifkan jika karyawan ini muncul di
                                    halaman kehadiran.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <BankAccountFields />
                <div className="flex gap-4">
                    <Button type="submit" disabled={form.formState.isSubmitting}>Simpan Perubahan</Button>
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
