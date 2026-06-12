"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "./button";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CarouselItem } from "../lib/content-types";

type WineCarouselProps = {
    items: CarouselItem[];
};

const TRANSITION_MS = 450;

function MobileNavButton({
    direction,
    onClick,
}: {
    direction: "prev" | "next";
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative z-20 shrink-0 cursor-pointer p-1 text-2xl text-white transition hover:opacity-80"
            aria-label={direction === "prev" ? "Předchozí víno" : "Další víno"}
        >
            <span aria-hidden>{direction === "prev" ? "‹" : "›"}</span>
        </button>
    );
}

export default function WineCarousel({ items }: WineCarouselProps) {
    const wines = items;
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [isAnimating, setIsAnimating] = useState(false);
    const [transitionKey, setTransitionKey] = useState(0);
    const activeIndexRef = useRef(0);

    const activeWine = useMemo(() => wines[activeIndex], [wines, activeIndex]);
    const prevWine = useMemo(() => wines[prevIndex], [wines, prevIndex]);

    const startTransition = (nextIndex: number, dir: "next" | "prev") => {
        if (nextIndex === activeIndexRef.current) {
            return;
        }

        setDirection(dir);
        setPrevIndex(activeIndexRef.current);
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setIsAnimating(true);
        setTransitionKey((current) => current + 1);
    };

    const goToPrevious = () => {
        const next = (activeIndexRef.current - 1 + wines.length) % wines.length;
        startTransition(next, "prev");
    };

    const goToNext = () => {
        const next = (activeIndexRef.current + 1) % wines.length;
        startTransition(next, "next");
    };

    useEffect(() => {
        if (!isAnimating) {
            return;
        }

        const timer = window.setTimeout(() => setIsAnimating(false), TRANSITION_MS);
        return () => window.clearTimeout(timer);
    }, [isAnimating, transitionKey]);

    const enterClass = direction === "next" ? "wine-carousel-enter-next" : "wine-carousel-enter-prev";
    const exitClass = direction === "next" ? "wine-carousel-exit-next" : "wine-carousel-exit-prev";
    const showPrevious = isAnimating && prevIndex !== activeIndex;

    if (wines.length === 0 || !activeWine) {
        return null;
    }

    return (
        <section className="relative w-full md:aspect-64/25">
            <div
                className="relative transition-colors duration-500 ease-in-out md:h-full md:overflow-hidden"
                style={{ backgroundColor: activeWine.color }}
            >
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-black/10 via-transparent to-black/25" />

                {/* Mobile layout */}
                <div className="relative z-10 md:hidden">
                    <div className="flex items-center gap-2 px-4 pt-4">
                        <MobileNavButton direction="prev" onClick={goToPrevious} />
                        <p className="min-w-0 flex-1 text-center font-serif text-lg leading-snug text-white">
                            {activeWine.name}
                        </p>
                        <MobileNavButton direction="next" onClick={goToNext} />
                    </div>

                    <div className="flex justify-center px-4">
                        <div className="relative">
                            {showPrevious ? (
                                <Image
                                    key={`exit-${transitionKey}-${prevIndex}`}
                                    src={prevWine.image}
                                    alt={prevWine.name}
                                    width={400}
                                    height={1000}
                                    priority
                                    className={`pointer-events-none absolute left-1/2 top-0 w-[min(50vw,200px)] max-h-[min(46dvh,420px)] -translate-x-1/2 h-auto object-contain drop-shadow-2xl ${exitClass}`}
                                />
                            ) : null}
                            <Image
                                key={`enter-${transitionKey}-${activeIndex}`}
                                src={activeWine.image}
                                alt={activeWine.name}
                                width={400}
                                height={1000}
                                priority
                                className={`w-[min(50vw,200px)] max-h-[min(46dvh,420px)] h-auto object-contain drop-shadow-2xl ${
                                    isAnimating ? enterClass : ""
                                }`}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 px-4 py-5 text-white">
                        <p className="font-sans text-base leading-relaxed">{activeWine.description}</p>

                        <div className="flex flex-col gap-4">
                            <Link
                                href={`/about-wine/${activeWine.productSlug}`}
                                className="font-sans text-base text-white underline"
                            >
                                Více o produktu
                            </Link>
                            <ButtonLink href={`/products?wine=${activeWine.productSlug}`} variant="black">
                                Přidat
                            </ButtonLink>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2 pb-4">
                        {wines.map((wine, index) => (
                            <button
                                key={wine.id}
                                type="button"
                                onClick={() => startTransition(index, index > activeIndexRef.current ? "next" : "prev")}
                                className={`h-1.5 rounded-full transition-all ${
                                    index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
                                }`}
                                aria-label={`Přejít na ${wine.name}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop layout */}
                <div className="relative z-10 mx-auto hidden h-full max-w-7xl flex-row items-center justify-between gap-12 px-6 py-12 md:flex">
                    <div className="w-1/2 space-y-6 text-white">
                        <p className="font-serif text-5xl leading-tight lg:text-6xl">{activeWine.name}</p>
                        <p className="max-w-xl font-sans text-lg">{activeWine.description}</p>

                        <div className="flex flex-col gap-8 sm:items-start">
                            <Link
                                href={`/about-wine/${activeWine.productSlug}`}
                                className="font-sans text-lg text-white underline"
                            >
                                Více o produktu
                            </Link>
                            <ButtonLink href={`/products?wine=${activeWine.productSlug}`} variant="black">
                                Přidat
                            </ButtonLink>
                        </div>
                    </div>

                    <div className="flex w-1/2 justify-center">
                        <div className="relative aspect-2/5 w-[360px] drop-shadow-2xl lg:w-[420px]">
                            {showPrevious ? (
                                <div
                                    key={`exit-d-${transitionKey}-${prevIndex}`}
                                    className={`pointer-events-none absolute inset-0 ${exitClass}`}
                                >
                                    <Image
                                        src={prevWine.image}
                                        alt={prevWine.name}
                                        fill
                                        priority
                                        className="object-contain"
                                        sizes="(min-width: 1024px) 420px, 360px"
                                    />
                                </div>
                            ) : null}
                            <div
                                key={`enter-d-${transitionKey}-${activeIndex}`}
                                className={`pointer-events-none absolute inset-0 ${
                                    isAnimating ? enterClass : "opacity-100"
                                }`}
                            >
                                <Image
                                    src={activeWine.image}
                                    alt={activeWine.name}
                                    fill
                                    priority
                                    className="object-contain"
                                    sizes="(min-width: 1024px) 420px, 360px"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 cursor-pointer p-3 text-4xl text-white transition md:block md:left-8 md:text-5xl"
                    aria-label="Předchozí víno"
                >
                    <span aria-hidden>&lsaquo;</span>
                </button>
                <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 cursor-pointer p-3 text-4xl text-white transition md:block md:right-8 md:text-5xl"
                    aria-label="Další víno"
                >
                    <span aria-hidden>&rsaquo;</span>
                </button>
            </div>
            <style jsx global>{`
                .wine-carousel-enter-next,
                .wine-carousel-enter-prev,
                .wine-carousel-exit-next,
                .wine-carousel-exit-prev {
                    animation-duration: 450ms;
                    animation-timing-function: ease;
                    animation-fill-mode: forwards;
                }

                .wine-carousel-enter-next,
                .wine-carousel-enter-prev {
                    animation-name: wine-fade-in;
                }
                .wine-carousel-exit-next,
                .wine-carousel-exit-prev {
                    animation-name: wine-fade-out;
                }

                @media (min-width: 768px) {
                    .wine-carousel-enter-next {
                        animation-name: wine-in-right;
                    }
                    .wine-carousel-enter-prev {
                        animation-name: wine-in-left;
                    }
                    .wine-carousel-exit-next {
                        animation-name: wine-out-left;
                    }
                    .wine-carousel-exit-prev {
                        animation-name: wine-out-right;
                    }
                }

                @keyframes wine-fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes wine-fade-out {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.96);
                    }
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
