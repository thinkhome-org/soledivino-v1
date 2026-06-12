import Navbar from "@/app/components/navbar";
import { getContact } from "@/app/lib/content";
import type { ReactNode } from "react";

function ContactRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-2 border-b border-black/10 py-6 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start sm:gap-8">
            <dt className="font-sans text-lg text-black/60">{label}</dt>
            <dd className="break-words font-sans text-lg leading-relaxed text-black">{children}</dd>
        </div>
    );
}

export default async function KontaktyPage() {
    const contact = await getContact();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-20">
                <h1 className="text-center font-serif text-4xl text-black md:text-6xl">Kontakt</h1>

                <p className="mx-auto mt-6 max-w-xl text-center font-sans text-base leading-relaxed text-black/60">
                    Máte dotaz k našim vínům nebo spolupráci? Ozvěte se nám — rádi vám poradíme.
                </p>

                <dl className="mt-14 rounded-xl border border-black px-6 md:px-10">
                    <ContactRow label="Název">
                        <span className="font-serif text-2xl text-black">{contact.name}</span>
                    </ContactRow>

                    <ContactRow label="Kontakt">
                        <div className="space-y-2">
                            <p>
                                <a href={`mailto:${contact.email}`} className="transition-opacity hover:opacity-70">
                                    {contact.email}
                                </a>
                            </p>
                            <p>
                                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="transition-opacity hover:opacity-70">
                                    {contact.phone}
                                </a>
                            </p>
                            <p>{contact.address}</p>
                        </div>
                    </ContactRow>

                    <ContactRow label="IČO">{contact.ico}</ContactRow>
                </dl>
            </main>
        </div>
    );
}
