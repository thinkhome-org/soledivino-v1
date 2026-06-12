import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/app/components/button";
import { getProductsRaw } from "@/app/lib/content";
import { WINE_TYPE_LABELS } from "@/app/lib/content-types";
import DeleteWineButton from "@/app/admin/components/delete-wine-button";
import { deleteWineAction } from "@/app/admin/vina/actions";

export default async function AdminWinesPage() {
    const products = await getProductsRaw();

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl text-black md:text-4xl">Vína</h1>
                    <p className="mt-2 font-sans text-black/60">Správa katalogu produktů.</p>
                </div>
                <ButtonLink href="/admin/vina/nove" className="w-full sm:w-auto">Přidat víno</ButtonLink>
            </div>

            {/* Mobile cards */}
            <div className="mt-8 space-y-4 md:hidden">
                {products.map((wine) => (
                    <div
                        key={wine.id}
                        className="rounded-2xl border border-black/10 bg-white p-4"
                    >
                        <div className="flex items-start gap-4">
                            <div className="relative h-16 w-12 shrink-0">
                                <Image
                                    src={wine.image}
                                    alt={wine.name}
                                    fill
                                    className="object-contain"
                                    sizes="48px"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="break-words font-sans text-base font-medium text-black">{wine.name}</p>
                                <p className="mt-1 font-sans text-sm text-black/70">{wine.region}</p>
                                <p className="mt-0.5 font-sans text-sm text-black/50">{WINE_TYPE_LABELS[wine.type]}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4 border-t border-black/5 pt-4">
                            <Link
                                href={`/admin/vina/${wine.id}`}
                                className="font-sans text-sm text-black underline-offset-2 hover:underline"
                            >
                                Upravit
                            </Link>
                            <DeleteWineButton
                                wineName={wine.name}
                                action={deleteWineAction.bind(null, wine.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table */}
            <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-black/10 bg-white md:block">
                <table className="w-full text-left">
                    <thead className="border-b border-black/10 bg-black/[0.02]">
                        <tr>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Obrázek
                            </th>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Název
                            </th>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Region
                            </th>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Typ
                            </th>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Akce
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((wine) => (
                            <tr key={wine.id} className="border-b border-black/5 last:border-0">
                                <td className="px-4 py-3">
                                    <div className="relative h-14 w-10">
                                        <Image
                                            src={wine.image}
                                            alt={wine.name}
                                            fill
                                            className="object-contain"
                                            sizes="40px"
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-sans text-sm text-black">{wine.name}</td>
                                <td className="px-4 py-3 font-sans text-sm text-black/70">{wine.region}</td>
                                <td className="px-4 py-3 font-sans text-sm text-black/70">
                                    {WINE_TYPE_LABELS[wine.type]}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Link
                                            href={`/admin/vina/${wine.id}`}
                                            className="font-sans text-sm text-black underline-offset-2 hover:underline"
                                        >
                                            Upravit
                                        </Link>
                                        <DeleteWineButton
                                            wineName={wine.name}
                                            action={deleteWineAction.bind(null, wine.id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
