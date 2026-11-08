import Image from "next/image";
import { ButtonLink } from "./button";
import Reveal from "./reveal";

function FilozofieContent({ compact = false }: { compact?: boolean }) {
    return (
        <div className={compact ? "max-w-xl" : "max-w-xl"}>
            <h2
                className={`font-serif font-bold text-black ${
                    compact ? "mb-5 text-3xl leading-tight" : "mb-8 text-4xl md:text-5xl"
                }`}
            >
                Naše filozofie
            </h2>

            <p
                className={`font-sans leading-relaxed text-black/70 ${
                    compact ? "mb-4 text-[0.95rem]" : "mb-6 text-sm md:text-base"
                }`}
            >
                V Sole di Vino věříme, že víno je víc než nápoj — je to příběh. Je to
                cesta do sluncem zalitých vinic, odraz italské vášně a pozvání ke stolu.
                Naše mise je jednoduchá: přinést autentický italský terroir přímo k vám
                domů.
            </p>

            <p
                className={`font-sans leading-relaxed text-black/70 ${
                    compact ? "mb-7 text-[0.95rem]" : "mb-10 text-sm md:text-base"
                }`}
            >
                Pečlivě vybíráme vína z malých, rodinných vinařství, která sdílejí náš
                závazek k tradici a kvalitě. Hledáme skvosty, které nesou pečeť
                unikátního mikroklimatu, od sopečné půdy Vesuvu až po minerální
                pobřežní oblasti.
            </p>

            <ButtonLink href="/products" className={compact ? "w-full sm:w-auto" : undefined}>
                Naše vína
            </ButtonLink>
        </div>
    );
}

export default function Filozofie() {
    return (
        <section className="relative overflow-hidden md:min-h-[580px]">
            <div className="absolute inset-0 hidden md:block">
                <Image
                    src="/main-objevte.jpg"
                    alt=""
                    fill
                    className="scale-[1.03] object-cover"
                    sizes="100vw"
                />
            </div>

            {/* Mobile: full-bleed image with overlapping content panel */}
            <div className="md:hidden">
                <div className="relative h-[42dvh] min-h-[240px]">
                    <Image
                        src="/main-objevte.jpg"
                        alt="Vinice"
                        fill
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                    <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"
                    />
                </div>

                <Reveal className="relative z-10 -mt-8 bg-white px-5 pb-12 pt-8">
                    <FilozofieContent compact />
                </Reveal>
            </div>

            <div className="relative z-10 hidden bg-white px-8 py-16 md:absolute md:inset-y-0 md:right-0 md:flex md:w-[52%] md:items-center md:px-14 md:py-20 lg:px-20">
                <FilozofieContent />
            </div>
        </section>
    );
}
