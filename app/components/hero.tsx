import Image from "next/image";
import { ButtonLink } from "./button";

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden">
            <div className="relative min-h-[78dvh] w-full sm:min-h-[520px] md:aspect-[4096/1600] md:min-h-[560px] lg:min-h-[620px]">
                <Image
                    src="/hero.png"
                    alt=""
                    fill
                    priority
                    className="object-cover object-[center_35%] md:object-center"
                    sizes="100vw"
                />

                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10 md:from-transparent md:via-transparent md:to-transparent"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-end gap-7 px-5 pb-10 pt-24 sm:justify-center sm:gap-12 sm:px-6 sm:pb-0 md:gap-16 lg:gap-20">
                    <h1 className="home-hero-copy max-w-[16ch] text-center font-serif text-[2.35rem] font-normal leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:max-w-none sm:text-5xl md:text-6xl md:text-black md:drop-shadow-none lg:text-7xl">
                        Ochutnejte slunce
                        <br />
                        v každém doušku
                    </h1>

                    <div className="home-hero-cta flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
                        <ButtonLink href="/products" className="w-full sm:w-auto">
                            Naše vína
                        </ButtonLink>
                        <ButtonLink
                            href="/mapa"
                            variant="gold"
                            className="w-full border border-white/25 sm:w-auto md:border-0"
                        >
                            Mapa
                        </ButtonLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
