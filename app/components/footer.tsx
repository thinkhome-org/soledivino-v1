import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-row gap-12 items-center">
                <Link href="/" className="flex flex-row gap-4 items-center">
                    <Image src="logo.svg" alt="Logo" height={20} width={20} />
                    <p className="text-white font-serif text-xl">Sole di Vino</p>
                </Link>
                <div className="flex flex-row gap-8 mt-1 items-center">
                <Link href="/">
                    <p>Podmínky použití</p>
                </Link>
                <Link href="/">
                    <p>Kontakt</p>
                </Link>
                <Link href="/">
                    <p>O nás</p>
                </Link>
                </div>
            </div>
        </footer>
    );
}
