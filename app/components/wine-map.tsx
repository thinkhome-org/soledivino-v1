"use client";

// Region SVG path data from simplemaps.com (free for commercial use,
// attribution appreciated): https://simplemaps.com/resources/svg-license

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePageTransition } from "./page-transition";
import {
    COUNTRY_DEFINITIONS,
    COUNTRY_OUTLINES,
    toRegionSlug,
    type CountryId,
} from "../lib/regions";

type WineMapProps = {
    regionCountsByCountry: Record<CountryId, Record<string, number>>;
    countryCounts: Record<CountryId, number>;
};

type TooltipState = {
    slug: string;
    name: string;
    count: number;
    x: number;
    y: number;
};

/** West → east cluster order */
const OVERVIEW_ORDER: CountryId[] = ["france", "germany", "austria", "italy"];

export default function WineMap({ regionCountsByCountry, countryCounts }: WineMapProps) {
    const { navigate } = usePageTransition();
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedCountry, setSelectedCountry] = useState<CountryId | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const [canHover, setCanHover] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(hover: hover) and (pointer: fine)");
        const update = () => setCanHover(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    const countryDef = selectedCountry ? COUNTRY_DEFINITIONS[selectedCountry] : null;
    const regionCounts = selectedCountry ? regionCountsByCountry[selectedCountry] : {};

    const updateTooltipPosition = (event: MouseEvent) => {
        const rect = mapRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        setTooltip((current) =>
            current
                ? {
                      ...current,
                      x: event.clientX - rect.left,
                      y: event.clientY - rect.top,
                  }
                : current,
        );
    };

    const showRegionTooltip = (slug: string, name: string, count: number, event: MouseEvent) => {
        if (!canHover) {
            return;
        }

        const rect = mapRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        setHovered(slug);
        setTooltip({
            slug,
            name,
            count,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const hideRegionTooltip = (slug: string) => {
        if (canHover) {
            setHovered((current) => (current === slug ? null : current));
            setTooltip((current) => (current?.slug === slug ? null : current));
        }
    };

    const hideAllTooltips = () => {
        setHovered(null);
        setTooltip(null);
    };

    const openCountry = (country: CountryId) => {
        hideAllTooltips();
        setSelectedCountry(country);
    };

    const backToCountries = () => {
        hideAllTooltips();
        setSelectedCountry(null);
    };

    const productsHref = (country: CountryId, slug: string) =>
        `/products?country=${country}&region=${slug}`;

    if (!selectedCountry || !countryDef) {
        const NEUTRAL = "#6E6862";

        // Organic stagger: varied size + vertical offset, gaps only (no overlap)
        const LAYOUT: Record<
            CountryId,
            { width: string; shift: string; order?: string }
        > = {
            france: {
                width: "w-[46%] sm:w-[28%] md:w-[26%]",
                shift: "self-center -translate-y-3 md:-translate-y-10",
            },
            germany: {
                width: "w-[42%] sm:w-[24%] md:w-[23%]",
                shift: "self-start translate-y-1 md:translate-y-0",
            },
            austria: {
                width: "w-[44%] sm:w-[22%] md:w-[22%]",
                shift: "self-end translate-y-4 md:translate-y-16",
            },
            italy: {
                width: "w-[48%] sm:w-[26%] md:w-[25%]",
                shift: "self-center translate-y-2 md:translate-y-8",
            },
        };

        return (
            <div
                className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-6 px-2 py-6 sm:flex-nowrap sm:items-end sm:gap-x-5 md:gap-x-7 md:py-10"
                role="list"
                aria-label="Země"
            >
                {OVERVIEW_ORDER.map((countryId) => {
                    const outline = COUNTRY_OUTLINES.find((c) => c.id === countryId);
                    const def = COUNTRY_DEFINITIONS[countryId];
                    const count = countryCounts[countryId] ?? 0;
                    const isActive = count > 0;
                    const layout = LAYOUT[countryId];

                    if (!outline) {
                        return null;
                    }

                    return (
                        <button
                            key={countryId}
                            type="button"
                            role="listitem"
                            onClick={() => openCountry(countryId)}
                            className={`group cursor-pointer bg-transparent p-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05] focus-visible:outline-none ${layout.width} ${layout.shift}`}
                            style={{ opacity: isActive ? 1 : 0.4 }}
                            aria-label={def.labelCs}
                        >
                            <svg
                                viewBox={outline.viewBox}
                                className="h-auto w-full"
                                aria-hidden
                            >
                                {outline.paths.map((p) => (
                                    <path
                                        key={p.id}
                                        d={p.d}
                                        className="stroke-[#EFEFEF] transition-[fill] duration-500 ease-out group-hover:fill-[#8B2D3D] group-focus-visible:fill-[#8B2D3D]"
                                        strokeWidth={1.1}
                                        style={{ fill: NEUTRAL }}
                                    />
                                ))}
                            </svg>
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={backToCountries}
                className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center text-[#1D1D1D]/45 transition-colors hover:text-[#8B2D3D]"
                aria-label="Zpět na země"
            >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 6 9 12l6 6" />
                </svg>
            </button>

            <div
                ref={mapRef}
                className="relative mx-auto w-full max-w-[640px] pt-8"
                onMouseLeave={hideAllTooltips}
            >
                <svg
                    viewBox={countryDef.viewBox}
                    className="h-auto w-full"
                    role="img"
                    aria-label={countryDef.labelCs}
                    onMouseMove={updateTooltipPosition}
                >
                    {countryDef.paths.map((p) => {
                        const name = countryDef.idToRegion[p.id] ?? p.id;
                        const slug = toRegionSlug(name);
                        const count = regionCounts[slug] ?? 0;
                        const isActive = count > 0;

                        if (!isActive) {
                            return (
                                <path
                                    key={p.id}
                                    d={p.d}
                                    className="fill-black/10 stroke-white"
                                    strokeWidth={1}
                                    style={{ pointerEvents: "none" }}
                                />
                            );
                        }

                        return (
                            <path
                                key={p.id}
                                d={p.d}
                                role="link"
                                tabIndex={0}
                                aria-label={name}
                                onClick={() => navigate(productsHref(selectedCountry, slug))}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        navigate(productsHref(selectedCountry, slug));
                                    }
                                }}
                                onMouseEnter={(event) =>
                                    showRegionTooltip(slug, name, count, event)
                                }
                                onMouseLeave={() => hideRegionTooltip(slug)}
                                className="cursor-pointer stroke-white outline-none transition-colors duration-200 hover:fill-[#8B2D3D] focus-visible:fill-[#8B2D3D]"
                                style={{ fill: hovered === slug ? "#8B2D3D" : "#9B7E3E" }}
                                strokeWidth={1}
                            />
                        );
                    })}
                </svg>

                {tooltip && canHover ? (
                    <div
                        key={tooltip.slug}
                        role="tooltip"
                        className="map-tooltip-in pointer-events-none absolute z-10 whitespace-nowrap rounded-xl border border-black/8 bg-[#f4f1ea] px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                        style={{ left: tooltip.x, top: tooltip.y }}
                    >
                        <p className="font-serif text-base leading-none text-[#1D1D1D]">
                            {tooltip.name}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
