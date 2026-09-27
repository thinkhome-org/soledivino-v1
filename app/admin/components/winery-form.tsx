"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";
import { Button } from "@/app/components/button";
import type { Product, Winery } from "@/app/lib/content-types";
import { findWineBySlug } from "@/app/lib/wine-slug";
import ImageUpload from "./image-upload";
import type { WineryFormState } from "../vinarstvi/actions";

type WineryFormProps = {
    winery?: Winery;
    products: Product[];
    action: (prevState: WineryFormState, formData: FormData) => Promise<WineryFormState>;
    submitLabel: string;
};

const initialState: WineryFormState = {};

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

const inputClassName =
    "w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40";

const compactButtonClass = "px-4 py-2.5 sm:px-8 sm:py-3.5";

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) {
        return items;
    }

    const copy = [...items];
    const [item] = copy.splice(index, 1);
    copy.splice(nextIndex, 0, item);
    return copy;
}

export default function WineryForm({ winery, products, action, submitLabel }: WineryFormProps) {
    const [state, formAction, pending] = useActionState(action, initialState);
    const [logo, setLogo] = useState(winery?.logo ?? "");
    const [tileImage, setTileImage] = useState(winery?.tileImage ?? "");
    const [heroImage, setHeroImage] = useState(winery?.heroImage ?? "");
    const [wineSlugs, setWineSlugs] = useState<string[]>(winery?.wineSlugs ?? []);
    const [selectedId, setSelectedId] = useState("");

    const selectedWines = useMemo(
        () =>
            wineSlugs
                .map((slug) => findWineBySlug(products, slug))
                .filter((wine): wine is Product => Boolean(wine)),
        [wineSlugs, products],
    );

    const availableProducts = products.filter(
        (product) => !selectedWines.some((wine) => wine.id === product.id),
    );
    const pickerId =
        availableProducts.some((product) => product.id === selectedId)
            ? selectedId
            : (availableProducts[0]?.id ?? "");

    const addSelectedWine = () => {
        const product = products.find((item) => item.id === pickerId) ?? availableProducts[0];
        if (!product) return;
        if (wineSlugs.includes(product.slug)) return;
        setWineSlugs([...wineSlugs, product.slug]);
        const remaining = availableProducts.filter((item) => item.id !== product.id);
        setSelectedId(remaining[0]?.id ?? "");
    };

    return (
        <form action={formAction} className="max-w-2xl space-y-8">
            <input type="hidden" name="wineSlugs" value={JSON.stringify(wineSlugs)} />

            <div className="space-y-6">
                <Field label="Název" required>
                    <input name="name" defaultValue={winery?.name} required className={inputClassName} />
                </Field>

                <Field label="Země" required hint="Text na detailu, např. Itálie.">
                    <input
                        name="country"
                        defaultValue={winery?.country ?? "Itálie"}
                        required
                        className={inputClassName}
                    />
                </Field>

                <Field label="Popis" required>
                    <textarea
                        name="description"
                        defaultValue={winery?.description}
                        required
                        rows={5}
                        className={`${inputClassName} resize-y`}
                    />
                </Field>

                <ImageUpload
                    name="logo"
                    value={logo}
                    onChange={setLogo}
                    label="Logo (volitelné)"
                    variant="logo"
                />

                <ImageUpload
                    name="tileImage"
                    value={tileImage}
                    onChange={setTileImage}
                    label="Fotka na mřížce *"
                    variant="landscape"
                />

                <ImageUpload
                    name="heroImage"
                    value={heroImage}
                    onChange={setHeroImage}
                    label="Hero fotka na detailu *"
                    variant="landscape"
                />
            </div>

            <fieldset className="space-y-5 border-t border-black/10 pt-8">
                <legend className="font-serif text-xl text-black">Vína vinařství</legend>
                <p className="font-sans text-sm text-black/60">
                    Pořadí na detailu stránky. Vína bereme z katalogu.
                </p>

                {products.length === 0 ? (
                    <p className="font-sans text-sm text-black/50">Nejdřív přidejte vína do katalogu.</p>
                ) : (
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="w-full flex-1 sm:min-w-[220px]">
                            <label className="mb-1.5 block font-sans text-sm text-black/70">
                                Přidat z katalogu
                            </label>
                            <select
                                value={pickerId}
                                onChange={(event) => setSelectedId(event.target.value)}
                                disabled={availableProducts.length === 0}
                                className={inputClassName}
                            >
                                {availableProducts.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                                {availableProducts.length === 0 ? (
                                    <option value="">Všechna vína jsou přiřazena</option>
                                ) : null}
                            </select>
                        </div>
                        <Button
                            type="button"
                            variant="gold"
                            className="w-full sm:w-auto"
                            disabled={availableProducts.length === 0}
                            onClick={addSelectedWine}
                        >
                            Přidat
                        </Button>
                    </div>
                )}

                {selectedWines.map((wine, index) => (
                    <div key={wine.id} className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <div className="relative h-20 w-12">
                                    <Image
                                        src={wine.image}
                                        alt={wine.name}
                                        fill
                                        className="object-contain"
                                        sizes="48px"
                                    />
                                </div>
                                <div>
                                    <p className="font-serif text-xl text-black">{wine.name}</p>
                                    <p className="font-sans text-xs text-black/50">Slug: {wine.slug}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="gold"
                                    className={compactButtonClass}
                                    onClick={() => setWineSlugs(moveItem(wineSlugs, index, -1))}
                                >
                                    ↑
                                </Button>
                                <Button
                                    type="button"
                                    variant="gold"
                                    className={compactButtonClass}
                                    onClick={() => setWineSlugs(moveItem(wineSlugs, index, 1))}
                                >
                                    ↓
                                </Button>
                                <Button
                                    type="button"
                                    variant="black"
                                    className={compactButtonClass}
                                    onClick={() =>
                                        setWineSlugs(wineSlugs.filter((_, itemIndex) => itemIndex !== index))
                                    }
                                >
                                    Odebrat
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </fieldset>

            {state.error ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">{state.error}</p>
            ) : null}

            {state.success ? (
                <p className="rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">
                    {state.success}
                </p>
            ) : null}

            <Button
                type="submit"
                disabled={pending || !tileImage || !heroImage}
                className="w-full sm:w-auto"
            >
                {pending ? "Ukládám…" : submitLabel}
            </Button>
        </form>
    );
}
