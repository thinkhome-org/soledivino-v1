import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="grid grid-cols-3 items-center">
                    <Link href="/" className="flex w-fit items-center">
                        <Image src="/logo.svg" alt="Logo" width={35} height={42} className="h-auto w-auto" />
                    </Link>
                    <h1 className="text-center text-2xl font-serif text-white">
                        <Link href="/" className="hover:text-white/90 transition-colors">
                            Nostra famiglia
                        </Link>
                    </h1>
                    <div className="flex items-center justify-end gap-6 md:gap-8">
                        <Link href="/" className="text-white hover:text-white/80 transition-colors font-sans">
                            O nás
                        </Link>
                        <Link href="/products" className="text-white hover:text-white/80 transition-colors font-sans">
                            Naše vína
                        </Link>
                        <Link href="/zadost" className="text-white hover:text-white/80 transition-colors font-sans">
                            Žádost
                        </Link>
                        <Link href="/kontakty" className="text-white hover:text-white/80 transition-colors font-sans">
                            Kontakty
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
