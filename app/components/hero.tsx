import Image from "next/image";
import Button from "next/link";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="w-full justify-center items-center">
            <Image src="/hero.png" alt="Hero" width={1920} height={1080} className="w-full h-auto object-cover" priority />
            <div className="absolute -top-10 left-0 w-full h-full flex flex-col justify-center gap-20 items-center">
                <h1 className="text-7xl text-center font-bold text-black font-serif">
                    Ochutnejte slunce <br /> v každém doušku
                </h1>
                <div className="flex flex-row gap-4">
                    <Link href="/nase-vina" className="text-white  transition-colors font-sans bg-black px-8 py-4 rounded-xl">
                        Naše vína
                    </Link>
                    <Link href="/o-nas" className="text-white  transition-colors font-sans bg-[#A18136] px-8 py-4 rounded-xl">
                        O nás
                    </Link>
                </div>
            </div>
        </div>
    );
}
