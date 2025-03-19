'use client'

import { useActionState } from 'react'
import { initialFormState } from '@tanstack/react-form/nextjs'
import { mergeForm, useForm, useStore, useTransform } from '@tanstack/react-form'
import validateAndSubmitMeasurements from '@/action'
import { formOpts } from '@/schemas/news-form'

export default function NewsForm() {

    const [state, action] = useActionState(validateAndSubmitMeasurements, initialFormState);

    const form = useForm({
        ...formOpts,
        transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
    })

    const formErrors = useStore(form.store, (formState) => formState.errors)

    const formFields = [
        {
            name: "temp",
            label: "Body Temperature",
            unit: "Degrees Celsius",
        },
        {
            name: "hr",
            label: "Heartrate",
            unit: "Beats per minute",
        },
        {
            name: "rr",
            label: "Respiratory rate",
            unit: "Breaths per minute",
        },
    ]

    return (
        <form action={action as never} onSubmit={() => form.handleSubmit()} className="flex flex-col gap-8">
            <h1 className="font-semibold text-xl">NEWS score calculator</h1>

         
            {formFields.map((fieldDefinition) => {
                return (
                    <form.Field
                        key={fieldDefinition.name}
                        name={fieldDefinition.name}
                    >

                        {(field) => {
                                console.log(field)
                                return (
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor={fieldDefinition.name} className="font-semibold">{fieldDefinition.label}</label>
                                        <p className="text-sm">{fieldDefinition.unit}</p>
                                        <input
                                            className="bg-foreground/5 "
                                            name={field.name}
                                            type="number"
                                            value={field.state.value === 0 ? '' : field.state.value}
                                            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                        />

                                        {field.state.meta.isDirty && field.state.meta.errors.map((error, index) => (
                                            <em className="text-red-400" role="alert" key={index}>{error.message}</em>
                                        ))}
                                    </div>
                                )
                                }}
                    </form.Field>
                )
            })}

      

            <div className="flex gap-4">
                <form.Subscribe
                    selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
                    >
                    {([canSubmit, isSubmitting]) => (
                    <button type="submit" disabled={!canSubmit} className={`bg-[#7424DA] py-2 px-4 rounded-3xl text-white`}>
                        {isSubmitting ? '...' : 'Calculate NEWS score'}
                    </button>
                    )}
                </form.Subscribe>
                <button className="bg-foreground/5 py-2 px-4 rounded-3xl" onClick={() => form.reset()}>Reset form</button>
            </div>

            {form.state.isSubmitSuccessful && (
                <>
                    {state.data && (
                        <div className='bg-[#FAF6FF] p-4 border border-[#7424DA66] rounded-xl'>News score: <strong>{state.data.score}</strong></div>
                    )}
                    {state.error && (
                        <div className='bg-red-200 p-4 border border-red-600 rounded-xl'>Something went wrong: <strong>{state.error.join(", ")}</strong></div>
                    )}
            
                    {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
                </>

            )}

            
            
        </form>
    )
}