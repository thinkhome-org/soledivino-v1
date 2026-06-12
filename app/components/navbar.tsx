"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "O nás" },
    { href: "/products", label: "Naše vína" },
    { href: "/mapa", label: "Mapa" },
    { href: "/zadost", label: "Žádost" },
    { href: "/kontakty", label: "Kontakty" },
];

function MenuIcon({ open }: { open: boolean }) {
    if (open) {
        return (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );
}

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-black text-white">
            <div className="mx-auto max-w-7xl px-6 py-4">
                {/* Mobile: logo + hamburger */}
                <div className="flex items-center justify-between md:hidden">
                    <Link href="/" className="flex w-fit items-center" onClick={() => setMenuOpen(false)}>
                        <Image src="/logo.svg" alt="Logo" width={35} height={42} className="h-auto w-auto" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
                    >
                        <MenuIcon open={menuOpen} />
                    </button>
                </div>

                {/* Desktop: 3-column grid */}
                <div className="hidden grid-cols-3 items-center md:grid">
                    <Link href="/" className="flex w-fit items-center">
                        <Image src="/logo.svg" alt="Logo" width={35} height={42} className="h-auto w-auto" />
                    </Link>
                    <h1 className="text-center font-serif text-2xl text-white">
                        <Link href="/" className="transition-colors hover:text-white/90">
                            Nostra famiglia
                        </Link>
                    </h1>
                    <div className="flex items-center justify-end gap-6 md:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="font-sans text-white transition-colors hover:text-white/80"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile dropdown */}
            <div
                className={`overflow-hidden border-t border-white/10 bg-black transition-all duration-300 ease-out md:hidden ${
                    menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="mx-auto max-w-7xl px-6 py-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block border-b border-white/10 py-4 font-sans text-lg text-white transition-colors last:border-0 hover:text-white/80"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
