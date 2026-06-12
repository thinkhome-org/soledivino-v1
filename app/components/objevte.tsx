import Image from "next/image";
import { ButtonLink } from "./button";

export default function Objevte() {
    return (
        <section className="relative min-h-[400px] w-full overflow-hidden md:min-h-[480px]">
            <Image
                src="/main-objevte.jpg"
                alt=""
                fill
                className="scale-[1.03] object-cover"
                sizes="100vw"
                priority
            />

            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-[#A88D47]/90 via-[#6B5A2E]/70 to-black/50 md:hidden"
            />

            <div
                aria-hidden
                className="absolute inset-0 hidden bg-gradient-to-r from-transparent from-[38%] via-black/20 via-[55%] to-black/55 md:block"
            />

            <div
                aria-hidden
                className="absolute inset-y-0 left-0 z-[1] hidden w-[42%] bg-[#A88D47] md:block md:rounded-r-[3rem]"
            />

            <div className="relative z-10 flex min-h-[400px] flex-col items-center justify-center gap-6 px-6 text-center md:min-h-[480px]">
                <h2 className="font-serif text-4xl font-bold text-white md:text-7xl">
                    Objevte vína podle regionu
                </h2>
                <h3 className="max-w-3xl font-serif text-lg text-white/95 md:text-3xl">
                    Prozkoumejte jedinečné lokace našich vín interaktivní formou
                </h3>
                <ButtonLink href="/mapa" variant="gold" className="mt-2">
                    Objevte
                </ButtonLink>
            </div>
        </section>
    );
}
