"use client";

import { FormEvent, useState } from "react";
import { Button } from "./button";
import { useWineSelection } from "../lib/wine-selection";

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

const fieldClassName =
    "w-full rounded-xl border border-black bg-white px-4 py-3 font-sans text-base text-black outline-none transition-colors focus:border-black";

export default function ZadostForm() {
    const { selectedWines, removeWine } = useWineSelection();
    const [form, setForm] = useState<FormState>(initialFormState);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
                <div className="space-y-5">
                    <label className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-4">
                        <span className="text-right font-sans text-lg text-black">Jméno</span>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            className={fieldClassName}
                            autoComplete="name"
                        />
                    </label>

                    <label className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-4">
                        <span className="text-right font-sans text-lg text-black">E-Mail</span>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                            className={fieldClassName}
                            autoComplete="email"
                        />
                    </label>

                    <label className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-4">
                        <span className="text-right font-sans text-lg text-black">Telefon</span>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                            className={fieldClassName}
                            autoComplete="tel"
                        />
                    </label>

                    <label className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-4">
                        <span className="pt-3 text-right font-sans text-lg text-black">Poznámka</span>
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

            <Button type="submit" className="mt-10 w-full rounded-xl py-5 text-lg">
                Odeslat poptávku
            </Button>

            {isSubmitted && (
                <p className="mt-4 text-center font-sans text-sm text-black/70" role="status">
                    Děkujeme, vaše poptávka byla odeslána.
                </p>
            )}
        </form>
    );
}
