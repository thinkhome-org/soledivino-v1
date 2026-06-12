"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Button } from "@/app/components/button";
import type { CarouselItem, FeaturedItem, Product } from "@/app/lib/content-types";
import { newId } from "@/app/lib/content-migrate";
import ImageUpload from "./image-upload";
import { saveCarouselAction, saveFeaturedAction } from "../domovska-stranka/actions";

type HomepageManagerProps = {
    products: Product[];
    initialCarousel: CarouselItem[];
    initialFeatured: FeaturedItem[];
};

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

const compactButtonClass = "px-4 py-2.5 sm:px-8 sm:py-3.5";

function ProductPicker({
    products,
    onSelect,
}: {
    products: Product[];
    onSelect: (product: Product) => void;
}) {
    const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div className="w-full flex-1 sm:min-w-[220px]">
                <label className="mb-1.5 block font-sans text-sm text-black/70">Přidat z katalogu</label>
                <select
                    value={selectedId}
                    onChange={(event) => setSelectedId(event.target.value)}
                    className="w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40"
                >
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
            </div>
            <Button
                type="button"
                variant="gold"
                className="w-full sm:w-auto"
                onClick={() => {
                    const product = products.find((item) => item.id === selectedId);
                    if (product) {
                        onSelect(product);
                    }
                }}
            >
                Přidat
            </Button>
        </div>
    );
}

function CarouselEditor({
    items,
    products,
    onChange,
}: {
    items: CarouselItem[];
    products: Product[];
    onChange: (items: CarouselItem[]) => void;
}) {
    const updateItem = (index: number, patch: Partial<CarouselItem>) => {
        onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    };

    const addFromProduct = (product: Product) => {
        onChange([
            ...items,
            {
                id: newId(),
                name: product.name,
                description: product.description,
                color: product.color,
                image: product.image,
                productSlug: product.slug,
            },
        ]);
    };

    return (
        <div className="space-y-4">
            <ProductPicker products={products} onSelect={addFromProduct} />

            {items.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-12">
                                <Image src={item.image} alt={item.name} fill className="object-contain" sizes="48px" />
                            </div>
                            <div>
                                <p className="font-serif text-xl text-black">{item.name}</p>
                                <p className="break-words font-sans text-xs text-black/50">Slug: {item.productSlug}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="gold" className={compactButtonClass} onClick={() => onChange(moveItem(items, index, -1))}>
                                ↑
                            </Button>
                            <Button type="button" variant="gold" className={compactButtonClass} onClick={() => onChange(moveItem(items, index, 1))}>
                                ↓
                            </Button>
                            <Button
                                type="button"
                                variant="black"
                                className={compactButtonClass}
                                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                            >
                                Odebrat
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block font-sans text-sm text-black/70">Název</label>
                            <input
                                value={item.name}
                                onChange={(event) => updateItem(index, { name: event.target.value })}
                                className="w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block font-sans text-sm text-black/70">Barva pozadí</label>
                            <input
                                type="color"
                                value={item.color}
                                onChange={(event) => updateItem(index, { color: event.target.value })}
                                className="h-12 w-full cursor-pointer rounded-xl border border-black/15 bg-white p-1"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="mb-1.5 block font-sans text-sm text-black/70">Popis</label>
                        <textarea
                            value={item.description}
                            onChange={(event) => updateItem(index, { description: event.target.value })}
                            rows={3}
                            className="w-full resize-y rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40"
                        />
                    </div>

                    <div className="mt-4">
                        <ImageUpload
                            name={`carousel-image-${item.id}`}
                            value={item.image}
                            onChange={(url) => updateItem(index, { image: url })}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function FeaturedEditor({
    items,
    products,
    onChange,
}: {
    items: FeaturedItem[];
    products: Product[];
    onChange: (items: FeaturedItem[]) => void;
}) {
    const updateItem = (index: number, patch: Partial<FeaturedItem>) => {
        onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    };

    const addFromProduct = (product: Product) => {
        onChange([
            ...items,
            {
                id: newId(),
                name: product.name,
                description: product.description,
                image: product.image,
                productSlug: product.slug,
            },
        ]);
    };

    return (
        <div className="space-y-4">
            <ProductPicker products={products} onSelect={addFromProduct} />

            {items.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-12">
                                <Image src={item.image} alt={item.name} fill className="object-contain" sizes="48px" />
                            </div>
                            <p className="font-serif text-xl text-black">{item.name}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="gold" className={compactButtonClass} onClick={() => onChange(moveItem(items, index, -1))}>
                                ↑
                            </Button>
                            <Button type="button" variant="gold" className={compactButtonClass} onClick={() => onChange(moveItem(items, index, 1))}>
                                ↓
                            </Button>
                            <Button
                                type="button"
                                variant="black"
                                className={compactButtonClass}
                                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                            >
                                Odebrat
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-4">
                        <div>
                            <label className="mb-1.5 block font-sans text-sm text-black/70">Název</label>
                            <input
                                value={item.name}
                                onChange={(event) => updateItem(index, { name: event.target.value })}
                                className="w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block font-sans text-sm text-black/70">Popis</label>
                            <textarea
                                value={item.description}
                                onChange={(event) => updateItem(index, { description: event.target.value })}
                                rows={3}
                                className="w-full resize-y rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40"
                            />
                        </div>
                        <ImageUpload
                            name={`featured-image-${item.id}`}
                            value={item.image}
                            onChange={(url) => updateItem(index, { image: url })}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function HomepageManager({
    products,
    initialCarousel,
    initialFeatured,
}: HomepageManagerProps) {
    const [carousel, setCarousel] = useState(initialCarousel);
    const [featured, setFeatured] = useState(initialFeatured);
    const [carouselMessage, setCarouselMessage] = useState<string | null>(null);
    const [featuredMessage, setFeaturedMessage] = useState<string | null>(null);
    const [pendingCarousel, startCarouselSave] = useTransition();
    const [pendingFeatured, startFeaturedSave] = useTransition();

    const handleSaveCarousel = () => {
        startCarouselSave(async () => {
            const result = await saveCarouselAction(carousel);
            setCarouselMessage(result.success ?? result.error ?? null);
        });
    };

    const handleSaveFeatured = () => {
        startFeaturedSave(async () => {
            const result = await saveFeaturedAction(featured);
            setFeaturedMessage(result.success ?? result.error ?? null);
        });
    };

    return (
        <div className="space-y-14">
            <section>
                <h2 className="font-serif text-2xl text-black md:text-3xl">Carousel</h2>
                <p className="mt-2 font-sans text-sm text-black/60">
                    Pořadí a obsah slidů na úvodní stránce.
                </p>
                <div className="mt-6">
                    <CarouselEditor items={carousel} products={products} onChange={setCarousel} />
                </div>
                {carouselMessage ? (
                    <p className="mt-4 font-sans text-sm text-black/70">{carouselMessage}</p>
                ) : null}
                <Button
                    type="button"
                    className="mt-4 w-full sm:w-auto"
                    disabled={pendingCarousel}
                    onClick={handleSaveCarousel}
                >
                    {pendingCarousel ? "Ukládám…" : "Uložit carousel"}
                </Button>
            </section>

            <section>
                <h2 className="font-serif text-2xl text-black md:text-3xl">Náš výběr</h2>
                <p className="mt-2 font-sans text-sm text-black/60">
                    Karty v sekci Náš výběr na domovské stránce.
                </p>
                <div className="mt-6">
                    <FeaturedEditor items={featured} products={products} onChange={setFeatured} />
                </div>
                {featuredMessage ? (
                    <p className="mt-4 font-sans text-sm text-black/70">{featuredMessage}</p>
                ) : null}
                <Button
                    type="button"
                    className="mt-4 w-full sm:w-auto"
                    disabled={pendingFeatured}
                    onClick={handleSaveFeatured}
                >
                    {pendingFeatured ? "Ukládám…" : "Uložit Náš výběr"}
                </Button>
            </section>
        </div>
    );
}
