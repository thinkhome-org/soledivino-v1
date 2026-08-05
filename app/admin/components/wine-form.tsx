"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/app/components/button";
import type { CountryId, NaturalCategory, Product, ProductionStyle, WineType } from "@/app/lib/content-types";
import {
    NATURAL_CATEGORY_LABELS,
    PRODUCTION_STYLE_LABELS,
    WINE_TYPE_LABELS,
} from "@/app/lib/content-types";
import {
    COUNTRY_DEFINITIONS,
    COUNTRY_LABELS,
    COUNTRY_ORDER,
} from "@/app/lib/regions";
import ImageUpload from "./image-upload";
import type { WineFormState } from "../vina/actions";

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
    hint,
}: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
    hint?: string;
}) {
    return (
        <div>
            <label className="mb-1.5 block font-sans text-sm text-black/70">
                {label}
                {required ? " *" : ""}
            </label>
            {children}
            {hint ? <p className="mt-1.5 font-sans text-xs text-black/45">{hint}</p> : null}
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <fieldset className="space-y-5 border-t border-black/10 pt-8">
            <legend className="font-serif text-xl text-black">{title}</legend>
            {children}
        </fieldset>
    );
}

const inputClassName =
    "w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40";

export default function WineForm({ wine, action, submitLabel }: WineFormProps) {
    const [state, formAction, pending] = useActionState(action, initialState);
    const [image, setImage] = useState(wine?.image ?? "");
    const [country, setCountry] = useState<CountryId>(wine?.country ?? "italy");

    const regioneOptions = useMemo(
        () =>
            [...COUNTRY_DEFINITIONS[country].regions].sort((a, b) => a.localeCompare(b, "cs")),
        [country],
    );

    const regioneDefault =
        wine?.regione && regioneOptions.includes(wine.regione) ? wine.regione : "";

    return (
        <form action={formAction} className="max-w-2xl space-y-8">
            <div className="space-y-6">
                <Field label="Název" required>
                    <input name="name" defaultValue={wine?.name} required className={inputClassName} />
                </Field>

                <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Země" required>
                        <select
                            name="country"
                            value={country}
                            required
                            className={inputClassName}
                            onChange={(event) => setCountry(event.target.value as CountryId)}
                        >
                            {COUNTRY_ORDER.map((id) => (
                                <option key={id} value={id}>
                                    {COUNTRY_LABELS[id]}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Region (zobrazení)" required hint="Text na kartě / detailu, např. Itálie.">
                        <input
                            name="region"
                            key={`region-display-${country}`}
                            defaultValue={wine?.region ?? COUNTRY_LABELS[country]}
                            required
                            className={inputClassName}
                        />
                    </Field>
                </div>

                <Field label="Regione (mapa)" required hint="Správní region pro filtr na mapě.">
                    <select
                        name="regione"
                        key={`regione-${country}`}
                        defaultValue={regioneDefault}
                        required
                        className={inputClassName}
                    >
                        <option value="">Vyberte region</option>
                        {regioneOptions.map((regione) => (
                            <option key={regione} value={regione}>
                                {regione}
                            </option>
                        ))}
                    </select>
                </Field>

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

                <Field label="Popis" required hint="Krátký úvod na detailu vína.">
                    <textarea
                        name="description"
                        defaultValue={wine?.description}
                        required
                        rows={4}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>

                <ImageUpload name="image" value={image} onChange={setImage} />
            </div>

            <Section title="Smyslový profil">
                <Field label="Aroma">
                    <textarea
                        name="aroma"
                        defaultValue={wine?.aroma}
                        rows={2}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
                <Field label="Chuťový profil">
                    <textarea
                        name="tasteProfile"
                        defaultValue={wine?.tasteProfile}
                        rows={2}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
                <Field label="Dochuť">
                    <textarea
                        name="finish"
                        defaultValue={wine?.finish}
                        rows={2}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
            </Section>

            <Section title="Původ a vinař">
                <Field label="Terroir">
                    <textarea
                        name="terroir"
                        defaultValue={wine?.terroir}
                        rows={3}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
                <Field label="Info o vinaři">
                    <textarea
                        name="winemaker"
                        defaultValue={wine?.winemaker}
                        rows={3}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
                <Field label="Filozofie vinaře" hint="Jak vinař přemýšlí o víně a práci ve vinici.">
                    <textarea
                        name="winemakerPhilosophy"
                        defaultValue={wine?.winemakerPhilosophy}
                        rows={3}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
            </Section>

            <Section title="Styl vína">
                <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Styl výroby">
                        <select
                            name="productionStyle"
                            defaultValue={wine?.productionStyle ?? ""}
                            className={inputClassName}
                        >
                            <option value="">— nevybráno —</option>
                            {(Object.keys(PRODUCTION_STYLE_LABELS) as ProductionStyle[]).map((style) => (
                                <option key={style} value={style}>
                                    {PRODUCTION_STYLE_LABELS[style]}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field
                        label="Hloubka naturálu"
                        hint="Kde víno sedí na škále od klasiky po radikální naturál."
                    >
                        <select
                            name="naturalCategory"
                            defaultValue={wine?.naturalCategory ?? ""}
                            className={inputClassName}
                        >
                            <option value="">— nevybráno —</option>
                            {(Object.keys(NATURAL_CATEGORY_LABELS) as NaturalCategory[]).map((category) => (
                                <option key={category} value={category}>
                                    {NATURAL_CATEGORY_LABELS[category]}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
                <Field label="Vysvětlení stylu" hint="Proč je víno tradiční / moderní — krátce lidsky.">
                    <textarea
                        name="productionStyleNote"
                        defaultValue={wine?.productionStyleNote}
                        rows={3}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
            </Section>

            <Section title="Párování a emoce">
                <Field label="Doporučené párování">
                    <textarea
                        name="pairing"
                        defaultValue={wine?.pairing}
                        rows={2}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
                <Field label="Emocionální stopa" hint="Volitelné — nálada / situace, ke které víno sedí.">
                    <textarea
                        name="emotionalTrace"
                        defaultValue={wine?.emotionalTrace}
                        rows={2}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>
            </Section>

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
