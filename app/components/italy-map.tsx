"use client";

// Italy regions SVG path data from simplemaps.com (free for commercial use,
// attribution appreciated): https://simplemaps.com/resources/svg-license

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import regionPaths from "../data/italy-regions-paths.json";
import winesData from "../data/products-wines.json";
import { SVG_ID_TO_REGION, toRegionSlug } from "../lib/regions";

type RegionPath = { id: string; d: string };

const paths: RegionPath[] = regionPaths;

function wineCountsBySlug(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const wine of winesData as { regione: string }[]) {
        const slug = toRegionSlug(wine.regione);
        counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
}

export default function ItalyMap() {
    const router = useRouter();
    const counts = useMemo(() => wineCountsBySlug(), []);
    const [hovered, setHovered] = useState<string | null>(null);

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
                            onClick={() => router.push(`/products?region=${slug}`)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    router.push(`/products?region=${slug}`);
                                }
                            }}
                            onMouseEnter={() => setHovered(slug)}
                            onMouseLeave={() => setHovered((s) => (s === slug ? null : s))}
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
                                onMouseEnter={() => setHovered(r.slug)}
                                onMouseLeave={() => setHovered((s) => (s === r.slug ? null : s))}
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
