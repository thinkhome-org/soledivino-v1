import Link from "next/link";
import { notFound } from "next/navigation";
import WineryForm from "@/app/admin/components/winery-form";
import { updateWineryAction } from "@/app/admin/vinarstvi/actions";
import { getProductsRaw, getWineriesRaw } from "@/app/lib/content";

export default async function EditWineryPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ saved?: string }>;
}) {
    const { id } = await params;
    const { saved } = await searchParams;
    const [wineries, products] = await Promise.all([getWineriesRaw(), getProductsRaw()]);
    const winery = wineries.find((item) => item.id === id);

    if (!winery) {
        notFound();
    }

    const boundAction = updateWineryAction.bind(null, id);

    return (
        <div>
            <Link href="/admin/vinarstvi" className="font-sans text-sm text-black/60 hover:text-black">
                ← Zpět na seznam
            </Link>
            <h1 className="mt-4 font-serif text-2xl text-black md:text-4xl">Upravit vinařství</h1>

            {saved === "1" ? (
                <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">
                    Vinařství bylo vytvořeno.
                </p>
            ) : null}

            <div className="mt-8">
                <WineryForm
                    winery={winery}
                    products={products}
                    action={boundAction}
                    submitLabel="Uložit změny"
                />
            </div>
        </div>
    );
}
