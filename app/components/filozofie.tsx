import Image from "next/image";
import { ButtonLink } from "./button";

export default function Filozofie() {
    return (
        <section className="relative w-full overflow-hidden min-h-[500px] md:min-h-[600px]">
            {/* Full background grape image */}
            <Image
                src="/main-objevte.jpg"
                alt="Vinice"
                fill
                className="object-cover"
                sizes="100vw"
            />

            <div
                aria-hidden
                className="absolute inset-0 hidden bg-white section-slash-white md:block"
            />

            <div className="absolute top-0 right-0 z-10 flex h-full w-full items-center bg-white md:w-[56%] md:bg-transparent">
                <div className="relative px-8 py-16 md:ml-12 md:px-14 md:py-12 lg:ml-16 lg:px-20 max-w-xl ml-auto">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-8">
                        Naše filozofie
                    </h2>

                    <p className="text-sm md:text-base text-black/70 font-sans mb-6 leading-relaxed">
                        V Sole di Vino věříme, že víno je víc než nápoj — je to
                        příběh. Je to cesta do sluncem zalitých vinic, odraz italské
                        vášně a pozvání ke stolu. Naše mise je jednoduchá: přinést
                        autentický italský terroir přímo k vám domů.
                    </p>

                    <p className="text-sm md:text-base text-black/70 font-sans mb-10 leading-relaxed">
                        Pečlivě vybíráme vína z malých, rodinných vinařství, která
                        sdílejí náš závazek k tradici a kvalitě. Hledáme skvosty, které
                        nesou pečeť unikátního mikroklimatu, od sopečné půdy
                        Vesuvu až po minerální pobřežní oblasti.
                    </p>

                    <ButtonLink href="/products">Naše vína</ButtonLink>
                </div>
            </div>
        </section>
    );
}
