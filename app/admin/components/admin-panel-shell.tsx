"use client";

import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "../actions";

const navItems = [
    { href: "/admin", label: "Přehled" },
    { href: "/admin/vina", label: "Vína" },
    { href: "/admin/domovska-stranka", label: "Domovská stránka" },
    { href: "/admin/kontakt", label: "Kontakt" },
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

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <>
            <nav className="mt-10 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className="block rounded-xl px-3 py-2.5 font-sans text-sm text-black/80 transition-colors hover:bg-black/5 hover:text-black"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto space-y-2 pt-8">
                <Link
                    href="/"
                    target="_blank"
                    onClick={onNavigate}
                    className="block rounded-xl px-3 py-2.5 font-sans text-sm text-black/70 transition-colors hover:bg-black/5"
                >
                    Zobrazit web ↗
                </Link>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full rounded-xl px-3 py-2.5 text-left font-sans text-sm text-red-700 transition-colors hover:bg-red-50"
                    >
                        Odhlásit
                    </button>
                </form>
            </div>
        </>
    );
}

export default function AdminPanelShell({ children }: { children: React.ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8f8f8] text-black">
            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-white px-4 py-3 md:hidden">
                <Link href="/admin" className="font-serif text-xl text-black" onClick={() => setDrawerOpen(false)}>
                    Soledivino
                </Link>
                <button
                    type="button"
                    onClick={() => setDrawerOpen((open) => !open)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-black transition-colors hover:bg-black/5"
                    aria-expanded={drawerOpen}
                    aria-label={drawerOpen ? "Zavřít menu" : "Otevřít menu"}
                >
                    <MenuIcon open={drawerOpen} />
                </button>
            </header>

            {/* Mobile drawer overlay */}
            {drawerOpen ? (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    aria-label="Zavřít menu"
                    onClick={() => setDrawerOpen(false)}
                />
            ) : null}

            {/* Mobile drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-black/10 bg-white px-5 py-8 transition-transform duration-300 ease-out md:hidden ${
                    drawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Link href="/admin" className="font-serif text-2xl text-black" onClick={() => setDrawerOpen(false)}>
                    Soledivino
                </Link>
                <p className="mt-1 font-sans text-xs uppercase tracking-wide text-black/50">Administrace</p>
                <SidebarNav onNavigate={() => setDrawerOpen(false)} />
            </aside>

            <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
                {/* Desktop sidebar */}
                <aside className="hidden w-64 shrink-0 flex-col border-r border-black/10 bg-white px-5 py-8 md:flex">
                    <Link href="/admin" className="font-serif text-2xl text-black">
                        Soledivino
                    </Link>
                    <p className="mt-1 font-sans text-xs uppercase tracking-wide text-black/50">
                        Administrace
                    </p>
                    <SidebarNav />
                </aside>

                <main className="flex-1 px-4 py-6 md:px-10 md:py-10">{children}</main>
            </div>
        </div>
    );
}
