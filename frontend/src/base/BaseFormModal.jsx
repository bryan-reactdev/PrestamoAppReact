import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function BaseFormModal({ isOpen, onOpenChange }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm();

    const onSubmit = async(data) => {
        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        onOpenChange(false);

        form.reset();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Título del formulario
                    </DialogTitle>
                    <DialogDescription>
                        Descripción del formulario
                    </DialogDescription>
                </DialogHeader>
                <form id="form-base" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-base-title">
                                        Title
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-base-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa el título"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    
                    <Button type="submit" form="form-base" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner /> : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
