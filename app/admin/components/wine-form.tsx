"use client";

import { useActionState, useState } from "react";
import { Button } from "@/app/components/button";
import type { Product, WineType } from "@/app/lib/content-types";
import { WINE_TYPE_LABELS } from "@/app/lib/content-types";
import ImageUpload from "./image-upload";
import type { WineFormState } from "../vina/actions";

const REGIONE_OPTIONS = [
    "Piemonte",
    "Valle d'Aosta",
    "Liguria",
    "Lombardia",
    "Trentino-Alto Adige",
    "Veneto",
    "Friuli-Venezia Giulia",
    "Emilia-Romagna",
    "Toscana",
    "Umbria",
    "Marche",
    "Lazio",
    "Abruzzo",
    "Molise",
    "Campania",
    "Puglia",
    "Basilicata",
    "Calabria",
    "Sicilia",
    "Sardegna",
];

type WineFormProps = {
    wine?: Product;
    action: (prevState: WineFormState, formData: FormData) => Promise<WineFormState>;
    submitLabel: string;
};

const initialState: WineFormState = {};

function Field({
    label,
    children,
    required,
}: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <div>
            <label className="mb-1.5 block font-sans text-sm text-black/70">
                {label}
                {required ? " *" : ""}
            </label>
            {children}
        </div>
    );
}

const inputClassName =
    "w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40";

export default function WineForm({ wine, action, submitLabel }: WineFormProps) {
    const [state, formAction, pending] = useActionState(action, initialState);
    const [image, setImage] = useState(wine?.image ?? "");

    return (
        <form action={formAction} className="max-w-2xl space-y-6">
            <Field label="Název" required>
                <input name="name" defaultValue={wine?.name} required className={inputClassName} />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
                <Field label="Region (zobrazení)" required>
                    <input name="region" defaultValue={wine?.region} required className={inputClassName} />
                </Field>

                <Field label="Regione (mapa)" required>
                    <select name="regione" defaultValue={wine?.regione} required className={inputClassName}>
                        <option value="">Vyberte region</option>
                        {REGIONE_OPTIONS.map((regione) => (
                            <option key={regione} value={regione}>
                                {regione}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Field label="Typ" required>
                    <select name="type" defaultValue={wine?.type ?? "red"} required className={inputClassName}>
                        {(Object.keys(WINE_TYPE_LABELS) as WineType[]).map((type) => (
                            <option key={type} value={type}>
                                {WINE_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Barva pozadí" required>
                    <input
                        name="color"
                        type="color"
                        defaultValue={wine?.color ?? "#632734"}
                        required
                        className="h-12 w-full cursor-pointer rounded-xl border border-black/15 bg-white p-1"
                    />
                </Field>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Field label="Alkohol">
                    <input name="alcohol" defaultValue={wine?.alcohol ?? "xx%"} className={inputClassName} />
                </Field>
                <Field label="Objem">
                    <input name="volume" defaultValue={wine?.volume ?? "0.75l"} className={inputClassName} />
                </Field>
                <Field label="Ročník">
                    <input name="vintage" defaultValue={wine?.vintage ?? "2020"} className={inputClassName} />
                </Field>
            </div>

            <Field label="Popis" required>
                <textarea
                    name="description"
                    defaultValue={wine?.description}
                    required
                    rows={5}
                    className={`${inputClassName} resize-y`}
                />
            </Field>

            <ImageUpload name="image" value={image} onChange={setImage} />

            {state.error ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">{state.error}</p>
            ) : null}

            {state.success ? (
                <p className="rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">
                    {state.success}
                </p>
            ) : null}

            <Button type="submit" disabled={pending || !image} className="w-full sm:w-auto">
                {pending ? "Ukládám…" : submitLabel}
            </Button>
        </form>
    );
}
