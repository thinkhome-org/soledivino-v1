import Link from "next/link";

const sections = [
    {
        href: "/admin/vina",
        title: "Vína",
        description: "Správa katalogu vín — přidávání, úpravy a mazání produktů.",
    },
    {
        href: "/admin/domovska-stranka",
        title: "Domovská stránka",
        description: "Carousel a sekce Náš výběr na úvodní stránce.",
    },
    {
        href: "/admin/kontakt",
        title: "Kontakt",
        description: "Kontaktní údaje zobrazené na stránce Kontakty.",
    },
    {
        href: "/admin/poptavka",
        title: "Poptávka",
        description: "Nastavení formuláře poptávky vín a doručení e-mailů.",
    },
];

export default function AdminDashboardPage() {
    return (
        <div>
            <h1 className="font-serif text-2xl text-black md:text-4xl">Přehled</h1>
            <p className="mt-2 max-w-2xl font-sans text-black/60">
                Vítejte v administraci. Vyberte sekci, kterou chcete upravit.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
                {sections.map((section) => (
                    <Link
                        key={section.href}
                        href={section.href}
                        className="rounded-2xl border border-black/10 bg-white p-6 transition-shadow hover:shadow-md"
                    >
                        <h2 className="font-serif text-2xl text-black">{section.title}</h2>
                        <p className="mt-2 font-sans text-sm leading-relaxed text-black/60">
                            {section.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
