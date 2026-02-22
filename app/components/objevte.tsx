import Image from "next/image";
import Link from "next/link";

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

            {/* Golden side mask with long sweeping curve */}
            <div className="hidden md:block absolute -top-[50%] -left-[25%] h-[190%] w-[72%] rounded-full bg-[#A88D47]" />

            {/* Centered text content */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center gap-6 items-center">
                <h2 className="text-5xl md:text-7xl font-bold text-white font-serif">
                    Objevte vína podle regionu
                </h2>
                <h3 className="text-xl md:text-3xl text-white font-serif">
                    Prozkoumejte jedinečné lokace našich vín interaktivní formou
                </h3>
                <Link
                    href="objevte"
                    className="text-white font-bold transition-colors font-sans bg-[#A18136] px-10 py-4 rounded-xl mt-6"
                >
                    Objevte
                </Link>
            </div>
        </section>
    );
}
