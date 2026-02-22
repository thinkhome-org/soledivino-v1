"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import winesData from "../data/wines.json";

type Wine = {
    name: string;
    description: string;
    color: string;
    image: string;
};

const wines: Wine[] = winesData;

export default function WineCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [isAnimating, setIsAnimating] = useState(false);

    const activeWine = useMemo(() => wines[activeIndex], [activeIndex]);
    const prevWine = useMemo(() => wines[prevIndex], [prevIndex]);

    const startTransition = (nextIndex: number, dir: "next" | "prev") => {
        setDirection(dir);
        setPrevIndex(activeIndex);
        setActiveIndex(nextIndex);
        setIsAnimating(true);
    };

    const goToPrevious = () => {
        startTransition((activeIndex - 1 + wines.length) % wines.length, "prev");
    };
    const goToNext = () => {
        startTransition((activeIndex + 1) % wines.length, "next");
    };

    useEffect(() => {
        if (!isAnimating) return;
        const timer = setTimeout(() => setIsAnimating(false), 450);
        return () => clearTimeout(timer);
    }, [isAnimating]);

    const enterAnimation = direction === "next" ? "animate-wine-in-right" : "animate-wine-in-left";
    const exitAnimation = direction === "next" ? "animate-wine-out-left" : "animate-wine-out-right";
    const showPrevious = isAnimating && prevIndex !== activeIndex;

    return (
        <section className="relative w-full aspect-64/25">
            <div className="relative h-full overflow-hidden transition-colors duration-500 ease-in-out" style={{ backgroundColor: activeWine.color }}>
                <div className="absolute inset-0 bg-linear-to-br from-black/10 via-transparent to-black/25 pointer-events-none" />

                <div className="relative h-full max-w-7xl mx-auto px-6 py-10 md:py-12 flex flex-col md:flex-row items-center gap-10 md:gap-12 justify-between">
                    <div className="w-full md:w-1/2 space-y-6 text-white">
                        <p className="text-5xl md:text-6xl font-serif leading-tight">{activeWine.name}</p>
                        <p className="text-lg md:text-xl font-sans max-w-xl">{activeWine.description}</p>

                        <div className="flex flex-col sm:flex-col gap-8 sm:items-start">
                            <Link href="/" className="underline text-white text-lg font-sans">
                                Více o produktu
                            </Link>
                            <Link href="/" className="text-white text-xl font-bold transition-colors font-sans bg-[#A18136] px-12 py-4 rounded-xl w-fit">
                                Přidat
                            </Link>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-[260px] sm:w-[320px] md:w-[360px] lg:w-[420px] aspect-2/5 drop-shadow-2xl">
                            {showPrevious && (
                                <div className={`absolute inset-0 flex justify-center items-center ${exitAnimation}`}>
                                    <Image src={prevWine.image} alt={prevWine.name} fill priority className="object-contain" sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 80vw" />
                                </div>
                            )}
                            <div className={`absolute inset-0 flex justify-center items-center ${isAnimating ? enterAnimation : "opacity-100"}`}>
                                <Image src={activeWine.image} alt={activeWine.name} fill priority className="object-contain" sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 80vw" />
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" onClick={goToPrevious} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white text-4xl md:text-5xl p-3  transition" aria-label="Předchozí víno">
                    <span aria-hidden>&lsaquo;</span>
                </button>

                <button type="button" onClick={goToNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white text-4xl md:text-5xl p-3 transition" aria-label="Další víno">
                    <span aria-hidden>&rsaquo;</span>
                </button>
            </div>
            <style jsx global>{`
                .animate-wine-in-right {
                    animation: wine-in-right 450ms ease forwards;
                }
                .animate-wine-in-left {
                    animation: wine-in-left 450ms ease forwards;
                }
                .animate-wine-out-left {
                    animation: wine-out-left 450ms ease forwards;
                }
                .animate-wine-out-right {
                    animation: wine-out-right 450ms ease forwards;
                }
                @keyframes wine-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(300%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes wine-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-300%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes wine-out-left {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-300%);
                    }
                }
                @keyframes wine-out-right {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(300%);
                    }
                }
            `}</style>
        </section>
    );
}
