import Image from "next/image";
import { ButtonLink } from "./button";

export default function Hero() {
    return (
        <section className="relative w-full">
            <div className="relative aspect-[4096/1600] w-full min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]">
                <Image
                    src="/hero.png"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 sm:gap-16 md:gap-20">
                    <h1 className="text-center font-serif text-4xl font-normal leading-tight tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
                        Ochutnejte slunce
                        <br />
                        v každém doušku
                    </h1>
                    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                        <ButtonLink href="/products">Naše vína</ButtonLink>
                        <ButtonLink href="/" variant="gold">
                            O nás
                        </ButtonLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
