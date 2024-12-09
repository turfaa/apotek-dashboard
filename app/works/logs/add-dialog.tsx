"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { createWorkLog, getWorkTypes, CreateWorkLogRequest } from "@/lib/api/work"
import { getEmployees } from "@/lib/api/employee"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { use, useEffect, useState, useRef, useCallback } from "react"
import { Employee } from "@/lib/api/employee"
import { WorkType } from "@/lib/api/work"
import { auth } from "@/lib/auth"
import { Trash2 } from "lucide-react"
import { Session } from "next-auth"

// Form schema matches the API types but handles string values for select inputs
const formSchema = z.object({
    employeeID: z.coerce.number({
        required_error: "Pilih karyawan",
        invalid_type_error: "Pilih karyawan",
    }),
    patientName: z.string().min(1, {
        message: "Masukkan nama pasien",
    }),
    units: z.array(z.object({
        workTypeID: z.coerce.number({
            required_error: "Pilih jenis pekerjaan",
            invalid_type_error: "Pilih jenis pekerjaan",
        }),
        workOutcome: z.string().min(1, {
            message: "Masukkan hasil pekerjaan",
        }),
    })).min(1, {
        message: "Tambahkan minimal 1 pekerjaan",
    }),
})

type FormData = z.infer<typeof formSchema>

interface AddWorkLogDialogProps {
    children: React.ReactNode
    sessionPromise: Promise<Session | null>
    employeesPromise: Promise<Employee[]>
    workTypesPromise: Promise<WorkType[]>
}

export function AddWorkLogDialog({ children, sessionPromise, employeesPromise, workTypesPromise }: AddWorkLogDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const patientNameRef = useRef<HTMLInputElement>(null)
    const workOutcomeRefs = useRef<(HTMLInputElement | null)[]>([])

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            employeeID: 0,
            patientName: "",
            units: [
                {
                    workTypeID: 0,
                    workOutcome: "",
                },
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "units",
    })


    // Update refs array when fields change
    useEffect(() => {
        workOutcomeRefs.current = workOutcomeRefs.current.slice(0, fields.length)
    }, [fields.length])

    const handleEmployeeChange = (value: string) => {
        form.setValue("employeeID", Number(value))
        // Use a longer delay to ensure the select dropdown is closed
        setTimeout(() => {
            patientNameRef.current?.focus()
        }, 100)
    }

    const handleWorkTypeChange = (value: string, index: number) => {
        form.setValue(`units.${index}.workTypeID`, Number(value))
        // Use a longer delay to ensure the select dropdown is closed
        setTimeout(() => {
            workOutcomeRefs.current[index]?.focus()
        }, 100)
    }

    const session = use(sessionPromise)
    const employees = use(employeesPromise)
    const workTypes = use(workTypesPromise)

    async function onSubmit(values: FormData) {
        try {
            const request: CreateWorkLogRequest = {
                employeeID: values.employeeID,
                patientName: values.patientName,
                units: values.units.map(unit => ({
                    workTypeID: unit.workTypeID,
                    workOutcome: unit.workOutcome,
                })),
            }
            await createWorkLog(request, session)
            toast.success("Laporan pekerjaan berhasil ditambahkan")
            setOpen(false)
            router.refresh()
            form.reset()
        } catch (error) {
            toast.error("Gagal menambahkan laporan pekerjaan")
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambah Laporan Pekerjaan</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="employeeID"
                            render={({ field: { value, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Karyawan</FormLabel>
                                    <Select
                                        onValueChange={handleEmployeeChange}
                                        value={value?.toString()}
                                        {...field}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih karyawan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem
                                                    key={employee.id}
                                                    value={employee.id.toString()}
                                                >
                                                    {employee.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="patientName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Pasien</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            ref={(el) => {
                                                if (typeof field.ref === 'function') {
                                                    field.ref(el)
                                                }
                                                patientNameRef.current = el
                                            }}
                                            placeholder="Masukkan nama pasien"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <FormLabel>Pekerjaan</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({
                                        workTypeID: 0,
                                        workOutcome: "",
                                    })}
                                >
                                    Tambah Pekerjaan
                                </Button>
                            </div>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name={`units.${index}.workTypeID`}
                                            render={({ field: { value, ...field } }) => (
                                                <FormItem>
                                                    <Select
                                                        onValueChange={(value) => handleWorkTypeChange(value, index)}
                                                        value={value?.toString()}
                                                        {...field}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih jenis pekerjaan" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {workTypes.map((workType) => (
                                                                <SelectItem
                                                                    key={workType.id}
                                                                    value={workType.id.toString()}
                                                                >
                                                                    {workType.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`units.${index}.workOutcome`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            ref={(el) => {
                                                                if (typeof field.ref === 'function') {
                                                                    field.ref(el)
                                                                }
                                                                workOutcomeRefs.current[index] = el
                                                            }}
                                                            placeholder={`Masukkan ${workTypes.find(
                                                                wt => wt.id === form.watch(`units.${index}.workTypeID`)
                                                            )?.outcomeUnit || 'data'}`}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {form.formState.errors.units?.root && (
                                <p className="text-sm font-medium text-destructive">
                                    {form.formState.errors.units.root.message}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit">Simpan</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 