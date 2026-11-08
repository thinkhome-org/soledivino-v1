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
        <section className="w-full bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="mb-12 font-serif text-4xl text-black md:text-5xl">
                    Náš výběr
                </h2>

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-0">
                    {items.map((wine) => (
                        <Link
                            key={wine.id}
                            href={`/products?wine=${wine.productSlug}`}
                            className="group relative isolate flex flex-col items-center overflow-hidden px-4 py-6 text-center"
                        >
                            <div
                                className="absolute inset-0 -z-10 hidden origin-top scale-y-0 md:block md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:scale-y-100"
                                style={{ backgroundColor: wine.color }}
                            />

                            <div
                                className="mb-4 h-[10px] w-full max-w-xs md:hidden"
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

                            <h3 className="mb-2 break-words font-serif text-lg font-bold text-[#1D1D1D] md:text-xl md:transition-colors md:duration-500 md:group-hover:text-white">
                                {wine.name}
                            </h3>
                            <p className="max-w-xs break-words font-sans text-sm leading-relaxed text-[#1D1D1D]/60 md:text-base md:transition-colors md:duration-500 md:group-hover:text-white/95">
                                {wine.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
