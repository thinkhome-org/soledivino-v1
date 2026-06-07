import Image from "next/image";
import Link from "next/link";
import winesData from "../data/nas-vyber-wines.json";
import { toWineSlug } from "../lib/wine-slug";

type WineCard = {
    name: string;
    description: string;
    image: string;
};

const wines: WineCard[] = winesData;

export default function NasVyber() {
    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-serif text-black mb-12">
                    Náš výběr
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                    {wines.map((wine) => (
                        <Link
                            key={wine.name}
                            href={`/products?wine=${toWineSlug(wine.name)}`}
                            className="group flex flex-col items-center text-center transition-opacity hover:opacity-80"
                        >
                            <div className="relative mb-6 h-64 w-40">
                                <Image
                                    src={wine.image}
                                    alt={wine.name}
                                    fill
                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                    sizes="160px"
                                />
                            </div>
                            <h3 className="mb-2 font-serif text-lg font-bold text-black md:text-xl">
                                {wine.name}
                            </h3>
                            <p className="max-w-xs font-sans text-sm leading-relaxed text-black/60 md:text-base">
                                {wine.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
