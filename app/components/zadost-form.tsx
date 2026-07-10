"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "./button";
import { useWineSelection } from "../lib/wine-selection";
import { submitInquiryAction, type InquiryFormState } from "../zadost/actions";

type FormState = {
    name: string;
    email: string;
    phone: string;
    note: string;
};

const initialFormState: FormState = {
    name: "",
    email: "",
    phone: "",
    note: "",
};

const initialActionState: InquiryFormState = {};

const fieldClassName =
    "w-full rounded-xl border border-black bg-white px-4 py-3 font-sans text-base text-black outline-none transition-colors focus:border-black";

const labelClassName =
    "flex flex-col gap-1 sm:grid sm:grid-cols-[110px_minmax(0,1fr)] sm:items-center sm:gap-4";

const labelTextClassName = "font-sans text-lg text-black sm:text-right";

type ZadostFormProps = {
    enabled: boolean;
    disabledMessage: string;
};

export default function ZadostForm({ enabled, disabledMessage }: ZadostFormProps) {
    const { selectedWines, removeWine, clearWines } = useWineSelection();
    const [form, setForm] = useState<FormState>(initialFormState);
    const [state, formAction, pending] = useActionState(submitInquiryAction, initialActionState);

    useEffect(() => {
        if (!state.success) {
            return;
        }

        setForm(initialFormState);
        clearWines();
    }, [state.success, clearWines]);

    if (!enabled) {
        return (
            <div className="mx-auto w-full max-w-5xl rounded-xl border border-black/15 bg-black/[0.02] px-6 py-10 text-center">
                <p className="font-sans text-base text-black/70">{disabledMessage}</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="mx-auto w-full max-w-5xl">
            <input type="hidden" name="wines" value={JSON.stringify(selectedWines)} />

            <div className="absolute -left-[9999px]" aria-hidden>
                <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
                <div className="space-y-5">
                    <label className={labelClassName}>
                        <span className={labelTextClassName}>Jméno</span>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            className={fieldClassName}
                            autoComplete="name"
                            required
                        />
                    </label>

                    <label className={labelClassName}>
                        <span className={labelTextClassName}>E-Mail</span>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                            className={fieldClassName}
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className={labelClassName}>
                        <span className={labelTextClassName}>Telefon</span>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                            className={fieldClassName}
                            autoComplete="tel"
                        />
                    </label>

                    <label className="flex flex-col gap-1 sm:grid sm:grid-cols-[110px_minmax(0,1fr)] sm:items-start sm:gap-4">
                        <span className={`${labelTextClassName} sm:pt-3`}>Poznámka</span>
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                            rows={6}
                            className={`${fieldClassName} resize-none`}
                        />
                    </label>
                </div>

                <aside className="flex min-h-[360px] flex-col rounded-xl border border-black bg-white p-6 lg:min-h-full">
                    <h2 className="font-serif text-2xl font-bold text-black">Vybraná vína:</h2>

                    {selectedWines.length === 0 ? (
                        <p className="mt-6 font-sans text-sm text-black/50">
                            Zatím nemáte vybraná žádná vína. Přidejte je tlačítkem Přidat na stránce vína.
                        </p>
                    ) : (
                        <ul className="mt-6 space-y-4">
                            {selectedWines.map((wine) => (
                                <li key={wine.slug} className="flex items-center justify-between gap-4">
                                    <span className="font-sans text-lg text-black">{wine.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeWine(wine.slug)}
                                        className="shrink-0 font-sans text-xl leading-none text-[#C62828] transition-opacity hover:opacity-70"
                                        aria-label={`Odebrat ${wine.name}`}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>
            </div>

            {state.error ? (
                <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-center font-sans text-sm text-red-700" role="alert">
                    {state.error}
                </p>
            ) : null}

            {state.success ? (
                <p className="mt-6 text-center font-sans text-sm text-black/70" role="status">
                    {state.success}
                </p>
            ) : null}

            <Button type="submit" disabled={pending} className="mt-10 w-full rounded-xl py-5 text-lg">
                {pending ? "Odesílám…" : "Odeslat poptávku"}
            </Button>
        </form>
    );
}
