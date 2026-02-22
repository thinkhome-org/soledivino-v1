import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-black text-white relative">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo on the left */}
                    <div className="shrink-0">
                        <Image src="/logo.svg" alt="Logo" width={35} height={42} className="w-auto h-auto" />
                    </div>

                    {/* Center text - "Nostra famiglia" - absolutely centered */}
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl text-white font-serif">Nostra famiglia</h1>

                    {/* Navigation links on the right */}
                    <div className="shrink-0 flex items-center gap-8">
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
