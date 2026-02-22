"use client";

import Image from "next/image";
import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import winesData from "../data/products-wines.json";

type ProductWine = {
    name: string;
    region: string;
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

export default function ProductsPage() {
    const rows = chunkWines(wines, WINES_PER_ROW);
    const [selectedWine, setSelectedWine] = useState<ProductWine | null>(null);

    return (
        <div className="min-h-screen bg-[#EFEFEF]">
            <Navbar />

            <main className="w-full">
                <div className="grid grid-cols-1 transition-all duration-500 md:grid-cols-[0_minmax(0,1fr)] md:data-[open=true]:grid-cols-[380px_minmax(0,1fr)]" data-open={selectedWine ? "true" : "false"}>
                    <aside className="h-full border-r border-black/10 bg-white">
                        {selectedWine && (
                            <div key={selectedWine.name} className="h-full md:sticky md:top-0 md:max-h-screen md:overflow-y-auto">
                                <div className="flex h-[480px] items-center justify-center" style={{ backgroundColor: selectedWine.color }}>
                                    <div className="panel-image-in relative h-[600px] w-[600px]">
                                        <Image src={selectedWine.image} alt={selectedWine.name} fill className="object-contain" sizes="180px" priority />
                                    </div>
                                </div>

                                <div className="px-8 py-10 text-center">
                                    <h2 className="panel-text-in-1 text-[46px] leading-[0.95] text-[#1D1D1D] font-serif">{selectedWine.name}</h2>
                                    <p className="panel-text-in-2 mt-1 text-[36px] leading-none text-[#1D1D1D] font-serif">{selectedWine.region}</p>
                                    <p className="panel-text-in-3 mx-auto mt-8 max-w-[250px] text-sm leading-relaxed text-[#1D1D1D]">{selectedWine.description}</p>
                                    <button type="button" className="panel-text-in-4 mt-8 h-11 w-full rounded-md bg-black text-xl font-semibold text-white transition-colors hover:bg-black/90">
                                        Více
                                    </button>
                                </div>
                            </div>
                        )}
                    </aside>

                    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-10">
                        {rows.map((row, rowIndex) => (
                            <div key={`row-${rowIndex}`}>
                                <div className="flex mt-2 h-[10px] w-full overflow-hidden">
                                    {row.map((wine) => (
                                        <div key={`${wine.name}-${rowIndex}-color`} className="h-full flex-1" style={{ backgroundColor: wine.color }} />
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
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
                        ))}
                    </section>
                </div>
            </main>

            <Footer />
            <style jsx global>{`
                @keyframes panel-image-in {
                    from {
                        opacity: 0;
                        transform: translateY(16px) scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes panel-text-in {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .panel-image-in {
                    animation: panel-image-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
                    animation-delay: 280ms;
                }
                .panel-text-in-1,
                .panel-text-in-2,
                .panel-text-in-3,
                .panel-text-in-4 {
                    opacity: 0;
                    animation: panel-text-in 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
                }
                .panel-text-in-1 {
                    animation-delay: 360ms;
                }
                .panel-text-in-2 {
                    animation-delay: 430ms;
                }
                .panel-text-in-3 {
                    animation-delay: 500ms;
                }
                .panel-text-in-4 {
                    animation-delay: 570ms;
                }
            `}</style>
        </div>
    );
}
