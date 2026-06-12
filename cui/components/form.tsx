"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Form as FormType, FormField } from "../types"

export interface FormProps {
    form: FormType
    footer?: React.ReactNode
    disabled?: boolean
    onSubmit: (values: Record<string, string>) => void
}

export default function Form({
    form,
    footer,
    disabled,
    onSubmit,
}: FormProps): React.ReactElement {
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(
            form.fields.map((field) => [field.id, field.value ?? ""]),
        ),
    )
    const [missingField, setMissingField] = useState<string | null>(null)

    const setValue = (id: string, value: string) => {
        setValues((prev) => ({ ...prev, [id]: value }))
        if (missingField === id && value.trim() !== "") {
            setMissingField(null)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const missing = form.fields.find(
            (field) => field.required && !values[field.id]?.trim(),
        )
        if (missing) {
            setMissingField(missing.id)
            return
        }

        setMissingField(null)
        onSubmit(values)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                {form.fields.map((field) => (
                    <div key={field.id} className="grid gap-2">
                        <Label htmlFor={field.id}>
                            {field.label}
                            {field.required && (
                                <span className="text-destructive"> *</span>
                            )}
                        </Label>
                        <FormFieldInput
                            field={field}
                            value={values[field.id] ?? ""}
                            disabled={disabled}
                            onChange={(value) => setValue(field.id, value)}
                        />
                        {missingField === field.id && (
                            <p className="text-sm text-destructive">
                                {field.label} wajib diisi
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {footer}
        </form>
    )
}

interface FormFieldInputProps {
    field: FormField
    value: string
    disabled?: boolean
    onChange: (value: string) => void
}

function FormFieldInput({
    field,
    value,
    disabled,
    onChange,
}: FormFieldInputProps): React.ReactElement {
    switch (field.type) {
        case "TEXTAREA":
            return (
                <Textarea
                    id={field.id}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
            )

        case "SELECT":
            return (
                <Select
                    value={value || undefined}
                    disabled={disabled}
                    onValueChange={onChange}
                >
                    <SelectTrigger id={field.id}>
                        <SelectValue placeholder={`Pilih ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {(field.options ?? []).map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )

        default:
            return (
                <Input
                    id={field.id}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
            )
    }
}
