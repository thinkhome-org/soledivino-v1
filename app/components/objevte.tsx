import { ButtonLink } from "./button";

export default function Objevte() {
    return (
        <section className="relative flex min-h-[400px] w-full flex-col items-center justify-center gap-6 bg-[#A88D47] px-6 text-center md:min-h-[480px]">
            <h2 className="font-serif text-4xl font-bold text-white md:text-7xl">
                Objevte vína podle regionu
            </h2>
            <h3 className="max-w-3xl font-serif text-lg text-white/95 md:text-3xl">
                Prozkoumejte jedinečné lokace našich vín interaktivní formou
            </h3>
            <ButtonLink href="/mapa" variant="black" className="mt-2">
                Objevte
            </ButtonLink>
        </section>
    );
}
