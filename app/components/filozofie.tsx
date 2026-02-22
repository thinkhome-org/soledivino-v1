import Image from "next/image";
import Link from "next/link";

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

            {/* White content panel with non-circular side mask */}
            <div className="absolute top-0 right-0 h-full w-full md:w-[56%] bg-white flex items-center">
                <div className="hidden md:block absolute -left-[180px] inset-y-0 w-[230px] bg-white [clip-path:ellipse(78%_55%_at_100%_50%)]" />

                <div className="relative z-10 px-8 md:px-14 lg:px-20 py-16 md:py-12 max-w-xl ml-auto md:ml-12 lg:ml-16">
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

                    <Link
                        href="/nase-vina"
                        className="inline-block text-white font-bold font-sans bg-black px-10 py-4 rounded-xl hover:bg-black/90 transition-colors"
                    >
                        Naše vína
                    </Link>
                </div>
            </div>
        </section>
    );
}
