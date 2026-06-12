import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto bg-black text-white">
            <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-8 sm:flex-row sm:items-center sm:gap-12">
                <Link href="/" className="flex items-center gap-4">
                    <Image src="/logo.svg" alt="Logo" height={20} width={20} />
                    <p className="font-serif text-xl text-white">Sole di Vino</p>
                </Link>
                <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                    <Link href="/" className="font-sans text-white transition-opacity hover:opacity-80">
                        Podmínky použití
                    </Link>
                    <Link href="/kontakty" className="font-sans text-white transition-opacity hover:opacity-80">
                        Kontakt
                    </Link>
                    <Link href="/" className="font-sans text-white transition-opacity hover:opacity-80">
                        O nás
                    </Link>
                </div>
            </div>
        </footer>
    );
}
