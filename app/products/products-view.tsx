"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AddWineIconButton } from "../components/add-wine-button";
import { Button } from "../components/button";
import Navbar from "../components/navbar";
import { usePageTransition } from "../components/page-transition";
import type { Product } from "../lib/content-types";
import { findWineBySlug } from "../lib/wine-slug";
import {
    COUNTRY_LABELS,
    parseCountryId,
    regionLabelForSlug,
    toRegionSlug,
} from "../lib/regions";
import type { CountryId } from "../lib/regions";

const WINES_PER_ROW = 3;

function chunkWines(items: Product[], size: number) {
    const rows: Product[][] = [];
    for (let i = 0; i < items.length; i += size) {
        rows.push(items.slice(i, i + size));
    }
    return rows;
}

function ProductsPageContent({
    products,
    initialWine,
}: {
    products: Product[];
    initialWine: Product | null;
}) {
    const { navigate } = usePageTransition();
    const searchParams = useSearchParams();
    const regionSlug = searchParams.get("region");
    const countryParam = parseCountryId(searchParams.get("country"));
    // Legacy ?region= without country → treat as Italy
    const filterCountry: CountryId | null = regionSlug
        ? (countryParam ?? "italy")
        : null;

    const visibleWines =
        regionSlug && filterCountry
            ? products.filter(
                  (wine) =>
                      (wine.country ?? "italy") === filterCountry &&
                      toRegionSlug(wine.regione) === regionSlug,
              )
            : products;

    const regionLabel =
        regionSlug && filterCountry
            ? visibleWines[0]?.regione ??
              regionLabelForSlug(filterCountry, regionSlug) ??
              regionSlug
            : null;
    const countryLabel = filterCountry ? COUNTRY_LABELS[filterCountry] : null;
    const rows = chunkWines(visibleWines, WINES_PER_ROW);
    const [selectedWine, setSelectedWine] = useState<Product | null>(initialWine);

    useEffect(() => {
        if (!selectedWine || window.matchMedia("(min-width: 768px)").matches) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [selectedWine]);

    const handleMoreClick = () => {
        if (!selectedWine) {
            return;
        }

        navigate(`/about-wine/${selectedWine.slug}`);
    };

    return (
        <div className="min-h-screen bg-[#EFEFEF]">
            <Navbar />

            <main className="relative w-full">
                <div
                    className="relative z-10 grid grid-cols-1 md:transition-all md:duration-500 md:grid-cols-[0_minmax(0,1fr)] md:data-[open=true]:grid-cols-[380px_minmax(0,1fr)]"
                    data-open={selectedWine ? "true" : "false"}
                >
                    {selectedWine ? (
                        <button
                            type="button"
                            className="wine-sheet-backdrop-in fixed inset-0 z-40 bg-black/40 md:hidden"
                            aria-label="Zavřít detail vína"
                            onClick={() => setSelectedWine(null)}
                        />
                    ) : null}

                    <aside
                        className={`border-r border-black/10 bg-white md:sticky md:top-16 md:z-auto md:self-start md:h-[calc(100vh-4rem)] md:overflow-y-auto ${
                            selectedWine
                                ? "wine-sheet-in fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto overscroll-contain rounded-t-2xl shadow-2xl md:static md:inset-auto md:max-h-none md:rounded-none md:shadow-none"
                                : "hidden md:block"
                        }`}
                    >
                        {selectedWine && (
                            <div
                                key={selectedWine.id}
                                className="relative flex h-full min-h-0 flex-col"
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedWine(null)}
                                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-[#1D1D1D] md:hidden"
                                    aria-label="Zavřít"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M6 6l12 12M18 6 6 18" />
                                    </svg>
                                </button>

                                <div className="flex min-h-[280px] flex-1 items-center justify-center md:min-h-[380px] md:flex-1" style={{ backgroundColor: selectedWine.color }}>
                                    <div className="panel-image-in relative mx-auto h-[280px] w-full max-w-[320px] md:h-[320px] md:w-[320px]">
                                        <Image src={selectedWine.image} alt={selectedWine.name} fill className="object-contain" sizes="320px" priority />
                                    </div>
                                </div>

                                <div className="shrink-0 px-6 py-8 text-center md:px-8 md:py-10">
                                    <h2 className="panel-text-in-1 break-words font-serif text-3xl leading-[0.95] text-[#1D1D1D] md:text-[46px]">{selectedWine.name}</h2>
                                    <p className="panel-text-in-2 mt-1 break-words font-serif text-2xl leading-none text-[#1D1D1D] md:text-[36px]">{selectedWine.region}</p>
                                    <p className="panel-text-in-3 mx-auto mt-8 max-w-[250px] text-sm leading-relaxed text-[#1D1D1D]">{selectedWine.description}</p>
                                    <div className="panel-text-in-4 mt-8 flex w-full items-stretch overflow-hidden rounded-2xl">
                                        <Button
                                            type="button"
                                            onClick={handleMoreClick}
                                            className="flex-1 rounded-none rounded-l-2xl"
                                        >
                                            Více
                                        </Button>
                                        <AddWineIconButton
                                            wineName={selectedWine.name}
                                            className="rounded-none rounded-r-2xl border-l border-white/15"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>

                    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-10">
                        {regionSlug && (
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
                                <p className="font-serif text-xl leading-none text-[#1D1D1D] md:text-[24px]">
                                    {regionLabel}
                                    {countryLabel ? (
                                        <span className="text-[#1D1D1D]/45"> · {countryLabel}</span>
                                    ) : null}
                                </p>
                                <Link
                                    href="/products"
                                    className="text-sm text-[#1D1D1D] underline-offset-4 md:transition-colors md:hover:text-[#8B2D3D] md:hover:underline"
                                >
                                    Zobrazit všechna vína
                                </Link>
                            </div>
                        )}

                        {visibleWines.length === 0 ? (
                            <p className="py-16 text-center text-[#1D1D1D]/70">
                                Pro tento region zatím nemáme žádná vína.
                            </p>
                        ) : null}

                        {rows.map((row, rowIndex) => {
                            const rowGridClass =
                                row.length === 1
                                    ? "md:grid-cols-1"
                                    : row.length === 2
                                      ? "md:grid-cols-2"
                                      : "md:grid-cols-3";
                            const colorBarGridClass =
                                row.length === 1
                                    ? "grid-cols-1"
                                    : row.length === 2
                                      ? "grid-cols-2"
                                      : "grid-cols-3";

                            return (
                            <div key={`row-${rowIndex}`} className={rowIndex === 0 ? "mt-2" : ""}>
                                <div
                                    className={`hidden h-[10px] overflow-hidden md:grid ${colorBarGridClass} gap-0`}
                                >
                                    {row.map((wine) => (
                                        <div
                                            key={`${wine.id}-${rowIndex}-color`}
                                            className="h-full min-w-0"
                                            style={{ backgroundColor: wine.color }}
                                        />
                                    ))}
                                </div>

                                <div className={`grid grid-cols-1 gap-0 ${rowGridClass}`}>
                                    {row.map((wine) => (
                                        <div key={`${wine.id}-${rowIndex}-cell`} className="min-w-0">
                                            <div
                                                className="-mx-6 h-[10px] md:hidden"
                                                style={{ backgroundColor: wine.color }}
                                            />
                                        <button
                                            type="button"
                                            data-selected={selectedWine?.id === wine.id ? "true" : "false"}
                                            onClick={() => setSelectedWine((current) => (current?.id === wine.id ? null : wine))}
                                            className="group relative isolate block h-full w-full cursor-pointer overflow-hidden px-4 py-6 text-center"
                                        >
                                            <div
                                                className="absolute inset-0 -z-10 hidden origin-top scale-y-0 md:block md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:scale-y-100 md:group-data-[selected=true]:scale-y-100"
                                                style={{ backgroundColor: wine.color }}
                                            />

                                            <div className="relative mx-auto h-[220px] w-full max-w-[300px] md:h-[300px] md:w-[300px]">
                                                <Image src={wine.image} alt={wine.name} fill className="object-contain" sizes="300px" priority />
                                            </div>

                                            <h3 className="mt-3 break-words font-serif text-xl leading-[1.05] text-[#1D1D1D] md:transition-colors md:duration-500 md:group-hover:text-white md:group-data-[selected=true]:text-white md:text-[24px]">{wine.name}</h3>

                                            <p className="mt-1 break-words pb-10 font-serif text-base leading-none text-[#1D1D1D] md:transition-colors md:duration-500 md:group-hover:text-white/95 md:group-data-[selected=true]:text-white/95 md:text-[20px]">{wine.region}</p>
                                        </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            );
                        })}
                    </section>
                </div>
            </main>
        </div>
    );
}

function ProductsPageContentWithParams({ products }: { products: Product[] }) {
    const searchParams = useSearchParams();
    const wineSlug = searchParams.get("wine");
    const initialWine = wineSlug ? findWineBySlug(products, wineSlug) ?? null : null;

    return (
        <ProductsPageContent
            key={wineSlug ?? "none"}
            products={products}
            initialWine={initialWine}
        />
    );
}

export default function ProductsView({ products }: { products: Product[] }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#EFEFEF]" />}>
            <ProductsPageContentWithParams products={products} />
        </Suspense>
    );
}
