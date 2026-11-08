import Image from "next/image";
import Link from "next/link";
import type { FeaturedItem } from "../lib/content-types";
import Reveal from "./reveal";

type NasVyberItem = FeaturedItem & {
    color: string;
};

type NasVyberProps = {
    items: NasVyberItem[];
};

export default function NasVyber({ items }: NasVyberProps) {
    return (
        <section className="w-full bg-white py-12 md:py-24">
            <div className="mx-auto max-w-7xl md:px-6">
                <Reveal className="mb-8 px-5 md:mb-12 md:px-0">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="font-serif text-3xl text-black md:text-5xl">Náš výběr</h2>
                        <Link
                            href="/products"
                            className="shrink-0 font-sans text-sm text-black/55 underline underline-offset-4 md:hidden"
                        >
                            Všechna vína
                        </Link>
                    </div>
                </Reveal>

                {/* Mobile: horizontal snap carousel */}
                <div className="home-snap-row flex gap-4 overflow-x-auto px-5 pb-2 md:hidden">
                    {items.map((wine, index) => (
                        <Reveal key={wine.id} delayMs={index * 70} className="home-snap-card w-[78vw] max-w-[300px] shrink-0">
                            <Link
                                href={`/products?wine=${wine.productSlug}`}
                                className="flex h-full flex-col overflow-hidden bg-[#F7F5F1]"
                            >
                                <div className="h-[6px] w-full" style={{ backgroundColor: wine.color }} />
                                <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-5 text-center">
                                    <div className="relative mb-5 h-52 w-32">
                                        <Image
                                            src={wine.image}
                                            alt={wine.name}
                                            fill
                                            className="object-contain"
                                            sizes="128px"
                                        />
                                    </div>
                                    <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-[#1D1D1D]">
                                        {wine.name}
                                    </h3>
                                    <p className="line-clamp-3 font-sans text-sm leading-relaxed text-[#1D1D1D]/60">
                                        {wine.description}
                                    </p>
                                    <span className="mt-5 font-sans text-sm text-[#1D1D1D]/80 underline underline-offset-4">
                                        Zobrazit
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>

                {/* Desktop grid */}
                <div className="hidden grid-cols-1 gap-10 sm:grid-cols-2 md:grid md:grid-cols-3 md:gap-0">
                    {items.map((wine) => (
                        <Link
                            key={wine.id}
                            href={`/products?wine=${wine.productSlug}`}
                            className="group relative isolate flex flex-col items-center overflow-hidden px-4 py-6 text-center"
                        >
                            <div
                                className="absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                                style={{ backgroundColor: wine.color }}
                            />

                            <div className="relative mb-6 h-64 w-40">
                                <Image
                                    src={wine.image}
                                    alt={wine.name}
                                    fill
                                    className="object-contain"
                                    sizes="160px"
                                />
                            </div>

                            <h3 className="mb-2 break-words font-serif text-lg font-bold text-[#1D1D1D] transition-colors duration-500 group-hover:text-white md:text-xl md:font-normal">
                                {wine.name}
                            </h3>
                            <p className="max-w-xs break-words font-sans text-sm leading-relaxed text-[#1D1D1D]/60 transition-colors duration-500 group-hover:text-white/95 md:text-base md:font-serif md:leading-none md:text-[#1D1D1D]">
                                {wine.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
