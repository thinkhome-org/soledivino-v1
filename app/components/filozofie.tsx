import Image from "next/image";
import { ButtonLink } from "./button";

function FilozofieContent() {
    return (
        <div className="max-w-xl">
            <h2 className="mb-8 font-serif text-4xl font-bold text-black md:text-5xl">
                Naše filozofie
            </h2>

            <p className="mb-6 font-sans text-sm leading-relaxed text-black/70 md:text-base">
                V Sole di Vino věříme, že víno je víc než nápoj — je to
                příběh. Je to cesta do sluncem zalitých vinic, odraz italské
                vášně a pozvání ke stolu. Naše mise je jednoduchá: přinést
                autentický italský terroir přímo k vám domů.
            </p>

            <p className="mb-10 font-sans text-sm leading-relaxed text-black/70 md:text-base">
                Pečlivě vybíráme vína z malých, rodinných vinařství, která
                sdílejí náš závazek k tradici a kvalitě. Hledáme skvosty, které
                nesou pečeť unikátního mikroklimatu, od sopečné půdy
                Vesuvu až po minerální pobřežní oblasti.
            </p>

            <ButtonLink href="/products">Naše vína</ButtonLink>
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

            <div className="relative h-[280px] md:hidden">
                <Image
                    src="/main-objevte.jpg"
                    alt="Vinice"
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
            </div>

            <div className="relative z-10 bg-white px-8 py-16 md:absolute md:inset-y-0 md:right-0 md:flex md:w-[52%] md:items-center md:rounded-l-[3rem] md:px-14 md:py-20 lg:px-20">
                <FilozofieContent />
            </div>
        </section>
    );
}
