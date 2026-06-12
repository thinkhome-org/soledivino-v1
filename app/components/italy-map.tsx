"use client";

// Italy regions SVG path data from simplemaps.com (free for commercial use,
// attribution appreciated): https://simplemaps.com/resources/svg-license

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePageTransition } from "./page-transition";
import regionPaths from "../data/italy-regions-paths.json";
import { SVG_ID_TO_REGION, toRegionSlug } from "../lib/regions";

type RegionPath = { id: string; d: string };

const paths: RegionPath[] = regionPaths;

type ItalyMapProps = {
    regionCounts: Record<string, number>;
};

export default function ItalyMap({ regionCounts }: ItalyMapProps) {
    const { navigate } = usePageTransition();
    const counts = useMemo(() => regionCounts, [regionCounts]);
    const [hovered, setHovered] = useState<string | null>(null);
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

    return (
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_240px] md:gap-12">
            <svg
                viewBox="0 0 1000 1000"
                className="h-auto w-full max-w-[640px] mx-auto"
                role="img"
                aria-label="Mapa regionu Italie"
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
                            onMouseEnter={() => {
                                if (canHover) {
                                    setHovered(slug);
                                }
                            }}
                            onMouseLeave={() => {
                                if (canHover) {
                                    setHovered((s) => (s === slug ? null : s));
                                }
                            }}
                            className="cursor-pointer stroke-white outline-none transition-colors duration-200 hover:fill-[#8B2D3D] focus-visible:fill-[#8B2D3D]"
                            style={{ fill: hovered === slug ? "#8B2D3D" : "#9B7E3E" }}
                            strokeWidth={1}
                        >
                            <title>{`${name} - ${count} vin`}</title>
                        </path>
                    );
                })}
            </svg>

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
