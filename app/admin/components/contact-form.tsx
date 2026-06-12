"use client";

import { useActionState } from "react";
import { Button } from "@/app/components/button";
import type { Contact } from "@/app/lib/content-types";
import { saveContactAction, type ContactFormState } from "../kontakt/actions";

const initialState: ContactFormState = {};

const inputClassName =
    "w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40";

export default function ContactForm({ contact }: { contact: Contact }) {
    const [state, formAction, pending] = useActionState(saveContactAction, initialState);

    return (
        <form action={formAction} className="max-w-2xl space-y-6">
            <div>
                <label className="mb-1.5 block font-sans text-sm text-black/70">Název *</label>
                <input name="name" defaultValue={contact.name} required className={inputClassName} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-1.5 block font-sans text-sm text-black/70">E-mail *</label>
                    <input
                        name="email"
                        type="email"
                        defaultValue={contact.email}
                        required
                        className={inputClassName}
                    />
                </div>
                <div>
                    <label className="mb-1.5 block font-sans text-sm text-black/70">Telefon *</label>
                    <input name="phone" defaultValue={contact.phone} required className={inputClassName} />
                </div>
            </div>

            <div>
                <label className="mb-1.5 block font-sans text-sm text-black/70">Adresa *</label>
                <textarea
                    name="address"
                    defaultValue={contact.address}
                    required
                    rows={3}
                    className={`${inputClassName} resize-y`}
                />
            </div>

            <div>
                <label className="mb-1.5 block font-sans text-sm text-black/70">IČO *</label>
                <input name="ico" defaultValue={contact.ico} required className={inputClassName} />
            </div>

            {state.error ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">{state.error}</p>
            ) : null}

            {state.success ? (
                <p className="rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">
                    {state.success}
                </p>
            ) : null}

            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
                {pending ? "Ukládám…" : "Uložit kontakt"}
            </Button>
        </form>
    );
}
