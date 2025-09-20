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
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Nama harus minimal 2 karakter.",
    }),
    shiftFee: z.number().positive({
        message: "Gaji per shift harus berupa angka positif.",
    }),
})

export function EmployeeForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            shiftFee: 0,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createEmployee(values.name, values.shiftFee)
            toast.success("Karyawan berhasil ditambahkan")
            router.push("/employees")
            router.refresh()
        } catch (error) {
            toast.error("Gagal menambahkan karyawan")
            console.error(error)
        }
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
                <div className="flex gap-4">
                    <Button type="submit">Tambah Karyawan</Button>
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
