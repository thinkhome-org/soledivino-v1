import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/app/components/button";
import { getWineriesRaw } from "@/app/lib/content";
import DeleteWineButton from "@/app/admin/components/delete-wine-button";
import { deleteWineryAction } from "@/app/admin/vinarstvi/actions";

export default async function AdminWineriesPage() {
    const wineries = await getWineriesRaw();

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl text-black md:text-4xl">Vinařství</h1>
                    <p className="mt-2 font-sans text-black/60">Správa stránek vinařů.</p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Link
                        href="/admin/vinarstvi/import"
                        className="inline-flex items-center justify-center rounded-2xl border border-black/15 px-8 py-3.5 font-sans text-sm text-black transition-colors hover:bg-black/5 sm:px-10 sm:py-4 sm:text-base"
                    >
                        Importovat JSON
                    </Link>
                    <ButtonLink href="/admin/vinarstvi/nove" className="w-full sm:w-auto">
                        Přidat vinařství
                    </ButtonLink>
                </div>
            </div>

            <div className="mt-8 space-y-4 md:hidden">
                {wineries.map((winery) => (
                    <div key={winery.id} className="rounded-2xl border border-black/10 bg-white p-4">
                        <div className="flex items-start gap-4">
                            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5">
                                <Image
                                    src={winery.tileImage}
                                    alt={winery.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="break-words font-sans text-base font-medium text-black">
                                    {winery.name}
                                </p>
                                <p className="mt-1 font-sans text-sm text-black/70">{winery.country}</p>
                                <p className="mt-0.5 font-sans text-sm text-black/50">
                                    {winery.wineSlugs.length} vín
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4 border-t border-black/5 pt-4">
                            <Link
                                href={`/admin/vinarstvi/${winery.id}`}
                                className="font-sans text-sm text-black underline-offset-2 hover:underline"
                            >
                                Upravit
                            </Link>
                            <DeleteWineButton
                                wineName={winery.name}
                                action={deleteWineryAction.bind(null, winery.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-black/10 bg-white md:block">
                <table className="w-full text-left">
                    <thead className="border-b border-black/10 bg-black/[0.02]">
                        <tr>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Fotka
                            </th>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Název
                            </th>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Země
                            </th>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Vína
                            </th>
                            <th className="px-4 py-3 font-sans text-xs uppercase tracking-wide text-black/50">
                                Akce
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {wineries.map((winery) => (
                            <tr key={winery.id} className="border-b border-black/5 last:border-0">
                                <td className="px-4 py-3">
                                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-black/5">
                                        <Image
                                            src={winery.tileImage}
                                            alt={winery.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-sans text-sm text-black">{winery.name}</td>
                                <td className="px-4 py-3 font-sans text-sm text-black/70">{winery.country}</td>
                                <td className="px-4 py-3 font-sans text-sm text-black/70">
                                    {winery.wineSlugs.length}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Link
                                            href={`/admin/vinarstvi/${winery.id}`}
                                            className="font-sans text-sm text-black underline-offset-2 hover:underline"
                                        >
                                            Upravit
                                        </Link>
                                        <DeleteWineButton
                                            wineName={winery.name}
                                            action={deleteWineryAction.bind(null, winery.id)}
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
