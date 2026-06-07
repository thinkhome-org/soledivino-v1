"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "../components/button";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import winesData from "../data/products-wines.json";
import { findWineBySlug, toWineSlug } from "../lib/wine-slug";
import { toRegionSlug } from "../lib/regions";

type ProductWine = {
    name: string;
    region: string;
    regione: string;
    color: string;
    image: string;
    description: string;
};

const wines: ProductWine[] = winesData;
const WINES_PER_ROW = 3;

function chunkWines(items: ProductWine[], size: number) {
    const rows: ProductWine[][] = [];
    for (let i = 0; i < items.length; i += size) {
        rows.push(items.slice(i, i + size));
    }
    return rows;
}

function ProductsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const regionSlug = searchParams.get("region");
    const visibleWines = regionSlug
        ? wines.filter((wine) => toRegionSlug(wine.regione) === regionSlug)
        : wines;
    const rows = chunkWines(visibleWines, WINES_PER_ROW);
    const regionLabel = regionSlug ? visibleWines[0]?.regione ?? regionSlug : null;
    const [selectedWine, setSelectedWine] = useState<ProductWine | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const wineSlug = searchParams.get("wine");
        if (!wineSlug) {
            return;
        }

        const wine = findWineBySlug(wines, wineSlug);
        if (wine) {
            setSelectedWine(wine);
        }
    }, [searchParams]);

    const handleMoreClick = () => {
        if (!selectedWine || isTransitioning) {
            return;
        }

        setIsTransitioning(true);
        const targetPath = `/about-wine/${toWineSlug(selectedWine.name)}`;
        window.setTimeout(() => {
            router.push(targetPath);
        }, 320);
    };

    return (
        <div className="min-h-screen bg-[#EFEFEF]">
            <Navbar />

            <main className="relative w-full" data-transitioning={isTransitioning ? "true" : "false"}>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-0 bg-white transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[transitioning=true]:w-full" data-transitioning={isTransitioning ? "true" : "false"} />
                <div
                    className="relative z-10 grid grid-cols-1 transition-all duration-500 md:grid-cols-[0_minmax(0,1fr)] md:data-[open=true]:grid-cols-[380px_minmax(0,1fr)] data-[transitioning=true]:opacity-0"
                    data-open={selectedWine ? "true" : "false"}
                    data-transitioning={isTransitioning ? "true" : "false"}
                >
                    <aside className="h-full border-r border-black/10 bg-white">
                        {selectedWine && (
                            <div
                                key={selectedWine.name}
                                className="flex h-full min-h-0 flex-col transition-opacity duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto md:data-[transitioning=true]:opacity-0"
                                data-transitioning={isTransitioning ? "true" : "false"}
                            >
                                <div className="flex min-h-[380px] flex-1 items-center justify-center md:min-h-0 md:flex-1" style={{ backgroundColor: selectedWine.color }}>
                                    <div className="panel-image-in relative h-[600px] w-[600px] shrink-0 md:h-[320px] md:w-[320px]">
                                        <Image src={selectedWine.image} alt={selectedWine.name} fill className="object-contain" sizes="320px" priority />
                                    </div>
                                </div>

                                <div className="shrink-0 px-8 py-10 text-center">
                                    <h2 className="panel-text-in-1 text-[46px] leading-[0.95] text-[#1D1D1D] font-serif">{selectedWine.name}</h2>
                                    <p className="panel-text-in-2 mt-1 text-[36px] leading-none text-[#1D1D1D] font-serif">{selectedWine.region}</p>
                                    <p className="panel-text-in-3 mx-auto mt-8 max-w-[250px] text-sm leading-relaxed text-[#1D1D1D]">{selectedWine.description}</p>
                                    <Button
                                        type="button"
                                        onClick={handleMoreClick}
                                        disabled={isTransitioning}
                                        className="panel-text-in-4 mt-8 w-full"
                                    >
                                        Více
                                    </Button>
                                </div>
                            </div>
                        )}
                    </aside>

                    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-10">
                        {regionSlug && (
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
                                <p className="text-[24px] leading-none text-[#1D1D1D] font-serif">
                                    Region: {regionLabel}
                                </p>
                                <Link
                                    href="/products"
                                    className="text-sm text-[#1D1D1D] underline-offset-4 transition-colors hover:text-[#8B2D3D] hover:underline"
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

                            return (
                            <div key={`row-${rowIndex}`}>
                                <div className={`mt-2 grid h-[10px] grid-cols-1 gap-0 ${rowGridClass}`}>
                                    {row.map((wine) => (
                                        <div key={`${wine.name}-${rowIndex}-color`} className="h-full" style={{ backgroundColor: wine.color }} />
                                    ))}
                                </div>

                                <div className={`grid grid-cols-1 gap-0 ${rowGridClass}`}>
                                    {row.map((wine) => (
                                        <button
                                            key={`${wine.name}-${rowIndex}`}
                                            type="button"
                                            data-selected={selectedWine === wine ? "true" : "false"}
                                            onClick={() => setSelectedWine((current) => (current === wine ? null : wine))}
                                            className="group relative isolate block h-full w-full overflow-hidden px-4 py-6 text-center"
                                        >
                                            <div
                                                className="absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-data-[selected=true]:scale-y-100"
                                                style={{ backgroundColor: wine.color }}
                                            />

                                            <div className="mx-auto relative h-[300px] w-[300px]">
                                                <Image src={wine.image} alt={wine.name} fill className="object-contain" sizes="300px" priority />
                                            </div>

                                            <h3 className="mt-3 text-[24px] leading-[1.05] text-[#1D1D1D] font-serif transition-colors duration-500 group-hover:text-white group-data-[selected=true]:text-white">{wine.name}</h3>

                                            <p className="mt-1 pb-10 text-[20px] leading-none text-[#1D1D1D] font-serif transition-colors duration-500 group-hover:text-white/95 group-data-[selected=true]:text-white/95">{wine.region}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            );
                        })}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#EFEFEF]" />}>
            <ProductsPageContent />
        </Suspense>
    );
}
