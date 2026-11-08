import { ButtonLink } from "./button";
import Reveal from "./reveal";

export default function Objevte() {
    return (
        <section className="relative w-full overflow-hidden bg-[#A88D47]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40 md:hidden"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 42%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.18), transparent 46%)",
                }}
            />

            <Reveal className="relative flex min-h-[300px] flex-col items-center justify-center gap-4 px-5 py-14 text-center md:min-h-[480px] md:gap-6 md:px-6 md:py-20">
                <p className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-white/75 md:hidden">
                    Interaktivní mapa
                </p>
                <h2 className="max-w-[14ch] font-serif text-[2.1rem] font-bold leading-[1.1] text-white md:max-w-none md:text-7xl">
                    Objevte vína podle regionu
                </h2>
                <h3 className="max-w-md font-serif text-base leading-snug text-white/95 md:max-w-3xl md:text-3xl">
                    Prozkoumejte jedinečné lokace našich vín interaktivní formou
                </h3>
                <ButtonLink href="/mapa" variant="black" className="mt-2 w-full max-w-xs md:w-auto">
                    Objevte
                </ButtonLink>
            </Reveal>
        </section>
    );
}
