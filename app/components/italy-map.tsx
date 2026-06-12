"use client";

// Italy regions SVG path data from simplemaps.com (free for commercial use,
// attribution appreciated): https://simplemaps.com/resources/svg-license

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { usePageTransition } from "./page-transition";
import regionPaths from "../data/italy-regions-paths.json";
import { SVG_ID_TO_REGION, toRegionSlug } from "../lib/regions";

type RegionPath = { id: string; d: string };

const paths: RegionPath[] = regionPaths;

type ItalyMapProps = {
    regionCounts: Record<string, number>;
};

type TooltipState = {
    slug: string;
    name: string;
    count: number;
    x: number;
    y: number;
};

export default function ItalyMap({ regionCounts }: ItalyMapProps) {
    const { navigate } = usePageTransition();
    const mapRef = useRef<HTMLDivElement>(null);
    const counts = useMemo(() => regionCounts, [regionCounts]);
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

    const activeRegions = useMemo(
        () =>
            paths
                .map((p) => {
                    const name = SVG_ID_TO_REGION[p.id] ?? p.id;
                    const slug = toRegionSlug(name);
                    return { name, slug, count: counts[slug] ?? 0 };
                })
                .filter((r) => r.count > 0)
                .sort((a, b) => a.name.localeCompare(b.name)),
        [counts],
    );

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

    return (
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_240px] md:gap-12">
            <div
                ref={mapRef}
                className="relative mx-auto w-full max-w-[640px]"
                onMouseLeave={hideAllTooltips}
            >
                <svg
                    viewBox="0 0 1000 1000"
                    className="h-auto w-full"
                    role="img"
                    aria-label="Mapa regionu Italie"
                    onMouseMove={updateTooltipPosition}
                >
                    {paths.map((p) => {
                        const name = SVG_ID_TO_REGION[p.id] ?? p.id;
                        const slug = toRegionSlug(name);
                        const count = counts[slug] ?? 0;
                        const isActive = count > 0;

                        if (!isActive) {
                            return (
                                <path
                                    key={p.id}
                                    d={p.d}
                                    className="fill-black/10 stroke-white"
                                    strokeWidth={1}
                                    style={{ pointerEvents: "none" }}
                                >
                                    <title>{name}</title>
                                </path>
                            );
                        }

                        return (
                            <path
                                key={p.id}
                                d={p.d}
                                role="link"
                                tabIndex={0}
                                aria-label={`${name} (${count})`}
                                onClick={() => navigate(`/products?region=${slug}`)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        navigate(`/products?region=${slug}`);
                                    }
                                }}
                                onMouseEnter={(event) => showRegionTooltip(slug, name, count, event)}
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
                        <p className="font-serif text-base leading-none text-[#1D1D1D]">{tooltip.name}</p>
                        <p className="mt-1 font-sans text-xs text-[#1D1D1D]/60">
                            {tooltip.count} {tooltip.count === 1 ? "víno" : tooltip.count < 5 ? "vína" : "vin"}
                        </p>
                    </div>
                ) : null}
            </div>

            <aside className="md:pt-4">
                <h2 className="text-lg font-serif text-[#1D1D1D]">Regiony</h2>
                <ul className="mt-4 space-y-1">
                    {activeRegions.map((r) => (
                        <li key={r.slug}>
                            <Link
                                href={`/products?region=${r.slug}`}
                                onMouseEnter={() => {
                                    if (canHover) {
                                        setHovered(r.slug);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (canHover) {
                                        setHovered((s) => (s === r.slug ? null : s));
                                    }
                                }}
                                className="flex items-center justify-between gap-3 py-1 text-sm text-[#1D1D1D] transition-colors hover:text-[#8B2D3D]"
                            >
                                <span>{r.name}</span>
                                <span className="text-[#1D1D1D]/50">{r.count}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}
