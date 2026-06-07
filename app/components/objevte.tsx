import Image from "next/image";
import { ButtonLink } from "./button";

export default function Objevte() {
    return (
        <section className="w-full relative overflow-hidden">
            {/* Background vineyard image with dark overlay */}
            <Image
                src="/main-objevte.jpg"
                alt="Objevte"
                width={1920}
                height={750}
                className="w-full h-auto object-cover aspect-64/25 brightness-35"
                priority
            />

            <div
                aria-hidden
                className="absolute inset-0 hidden bg-[#A88D47] section-slash-gold md:block"
            />

            {/* Centered text content */}
            <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center gap-6">
                <h2 className="text-5xl md:text-7xl font-bold text-white font-serif">
                    Objevte vína podle regionu
                </h2>
                <h3 className="text-xl md:text-3xl text-white font-serif">
                    Prozkoumejte jedinečné lokace našich vín interaktivní formou
                </h3>
                <ButtonLink href="/mapa" variant="gold" className="mt-6">
                    Objevte
                </ButtonLink>
            </div>
        </section>
    );
}
