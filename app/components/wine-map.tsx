"use client";

// Region / country SVG path data from simplemaps.com (free for commercial use,
// attribution appreciated): https://simplemaps.com/resources/svg-license

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePageTransition } from "./page-transition";
import {
    COUNTRY_DEFINITIONS,
    COUNTRY_LABELS,
    EUROPE_COUNTRIES,
    ISO2_TO_COUNTRY_ID,
    loadCountryRegionPaths,
    toRegionSlug,
    type CountryId,
    type RegionPath,
} from "../lib/regions";

type WineMapProps = {
    regionCountsByCountry: Record<string, Record<string, number>>;
    countryCounts: Record<string, number>;
};

type TooltipState = {
    slug: string;
    name: string;
    count: number;
    x: number;
    y: number;
};

const NEUTRAL = "#6E6862";
const ACTIVE = "#9B7E3E";
const HOVER = "#8B2D3D";

export default function WineMap({ regionCountsByCountry, countryCounts }: WineMapProps) {
    const { navigate } = usePageTransition();
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedCountry, setSelectedCountry] = useState<CountryId | null>(null);
    const [regionPaths, setRegionPaths] = useState<RegionPath[] | null>(null);
    const [loadingRegions, setLoadingRegions] = useState(false);
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

    useEffect(() => {
        if (!selectedCountry) {
            setRegionPaths(null);
            return;
        }

        let cancelled = false;
        setLoadingRegions(true);
        setRegionPaths(null);

        loadCountryRegionPaths(selectedCountry)
            .then((paths) => {
                if (!cancelled) {
                    setRegionPaths(paths);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingRegions(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [selectedCountry]);

    const countryDef = selectedCountry ? COUNTRY_DEFINITIONS[selectedCountry] : null;
    const regionCounts = selectedCountry ? (regionCountsByCountry[selectedCountry] ?? {}) : {};

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

    const showTooltip = (slug: string, name: string, count: number, event: MouseEvent) => {
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

    const hideTooltip = (slug: string) => {
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
        return (
            <div
                ref={mapRef}
                className="relative flex h-full min-h-0 w-full flex-1 items-center justify-center"
                onMouseLeave={hideAllTooltips}
            >
                <svg
                    viewBox={EUROPE_COUNTRIES.viewBox}
                    className="block h-full w-full"
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label="Evropa"
                    onMouseMove={updateTooltipPosition}
                >
                    {EUROPE_COUNTRIES.paths.map((p) => {
                        const countryId = ISO2_TO_COUNTRY_ID[p.id];
                        if (!countryId) {
                            return (
                                <path
                                    key={p.id}
                                    d={p.d}
                                    className="fill-black/10 stroke-[#EFEFEF]"
                                    strokeWidth={0.4}
                                    style={{ pointerEvents: "none" }}
                                />
                            );
                        }

                        const count = countryCounts[countryId] ?? 0;
                        const isActive = count > 0;
                        const label = COUNTRY_LABELS[countryId];
                        const fill =
                            hovered === countryId ? HOVER : isActive ? ACTIVE : NEUTRAL;

                        return (
                            <path
                                key={p.id}
                                d={p.d}
                                role="button"
                                tabIndex={0}
                                aria-label={label}
                                onClick={() => openCountry(countryId)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openCountry(countryId);
                                    }
                                }}
                                onMouseEnter={(event) =>
                                    showTooltip(countryId, label, count, event)
                                }
                                onMouseLeave={() => hideTooltip(countryId)}
                                className="cursor-pointer stroke-[#EFEFEF] outline-none transition-[fill] duration-300"
                                strokeWidth={0.45}
                                style={{ fill, opacity: isActive ? 1 : 0.45 }}
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
        );
    }

    return (
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col">
            <button
                type="button"
                onClick={backToCountries}
                className="absolute left-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/8 text-[#1D1D1D] transition-colors hover:bg-black/12 hover:text-[#8B2D3D] md:h-12 md:w-12"
                aria-label="Zpět na země"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="h-6 w-6 md:h-7 md:w-7"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M15 6 9 12l6 6" />
                </svg>
            </button>

            <div
                ref={mapRef}
                className="relative flex h-full min-h-0 w-full flex-1 items-center justify-center pt-12 md:pt-14"
                onMouseLeave={hideAllTooltips}
            >
                {loadingRegions || !regionPaths ? (
                    <div className="flex h-full w-full items-center justify-center font-sans text-sm text-[#1D1D1D]/45">
                        Načítám mapu…
                    </div>
                ) : (
                    <svg
                        viewBox={countryDef.viewBox}
                        className="block h-full w-full"
                        preserveAspectRatio="xMidYMid meet"
                        role="img"
                        aria-label={countryDef.labelCs}
                        onMouseMove={updateTooltipPosition}
                    >
                        {regionPaths.map((p) => {
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
                                        showTooltip(slug, name, count, event)
                                    }
                                    onMouseLeave={() => hideTooltip(slug)}
                                    className="cursor-pointer stroke-white outline-none transition-colors duration-200 hover:fill-[#8B2D3D] focus-visible:fill-[#8B2D3D]"
                                    style={{ fill: hovered === slug ? HOVER : ACTIVE }}
                                    strokeWidth={1}
                                />
                            );
                        })}
                    </svg>
                )}

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
