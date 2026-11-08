import Image from "next/image";
import Link from "next/link";
import type { FeaturedItem } from "../lib/content-types";

type NasVyberItem = FeaturedItem & {
    color: string;
};

type NasVyberProps = {
    items: NasVyberItem[];
};

export default function NasVyber({ items }: NasVyberProps) {
    return (
        <section className="w-full bg-white py-14 md:py-24">
            <div className="mx-auto max-w-7xl md:px-6">
                <div className="mb-8 flex items-end justify-between gap-4 px-5 md:mb-12 md:px-0">
                    <h2 className="font-serif text-3xl text-black md:text-5xl">Náš výběr</h2>
                    <Link
                        href="/products"
                        className="shrink-0 pb-1 font-sans text-sm text-black/50 underline underline-offset-4 md:hidden"
                    >
                        Všechna vína
                    </Link>
                </div>

                {/* Mobile: horizontal snap */}
                <div className="flex gap-3 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory md:hidden [&::-webkit-scrollbar]:hidden">
                    {items.map((wine) => (
                        <Link
                            key={wine.id}
                            href={`/products?wine=${wine.productSlug}`}
                            className="w-[72vw] max-w-[280px] shrink-0 snap-center border border-black/8 bg-white"
                        >
                            <div className="h-1.5 w-full" style={{ backgroundColor: wine.color }} />
                            <div className="flex flex-col items-center px-4 pb-5 pt-5 text-center">
                                <div className="relative mb-4 h-48 w-28">
                                    <Image
                                        src={wine.image}
                                        alt={wine.name}
                                        fill
                                        className="object-contain"
                                        sizes="112px"
                                    />
                                </div>
                                <h3 className="font-serif text-lg font-bold leading-snug text-[#1D1D1D]">
                                    {wine.name}
                                </h3>
                                <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-[#1D1D1D]/55">
                                    {wine.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Desktop / tablet grid */}
                <div className="hidden grid-cols-1 gap-10 px-6 sm:grid-cols-2 md:grid md:grid-cols-3 md:gap-0 md:px-0">
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

                            <h3 className="mb-2 break-words font-serif text-lg font-bold text-[#1D1D1D] transition-colors duration-500 group-hover:text-white md:text-xl">
                                {wine.name}
                            </h3>
                            <p className="max-w-xs break-words font-sans text-sm leading-relaxed text-[#1D1D1D]/60 transition-colors duration-500 group-hover:text-white/95 md:text-base">
                                {wine.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
