import Link from "next/link";
import { notFound } from "next/navigation";
import WineForm from "@/app/admin/components/wine-form";
import { updateWineAction } from "@/app/admin/vina/actions";
import { getProductsRaw } from "@/app/lib/content";

export default async function EditWinePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ saved?: string }>;
}) {
    const { id } = await params;
    const { saved } = await searchParams;
    const products = await getProductsRaw();
    const wine = products.find((product) => product.id === id);

    if (!wine) {
        notFound();
    }

    const boundAction = updateWineAction.bind(null, id);

    return (
        <div>
            <Link href="/admin/vina" className="font-sans text-sm text-black/60 hover:text-black">
                ← Zpět na seznam
            </Link>
            <h1 className="mt-4 font-serif text-2xl text-black md:text-4xl">Upravit víno</h1>

            {saved === "1" ? (
                <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">
                    Víno bylo vytvořeno.
                </p>
            ) : null}

            <div className="mt-8">
                <WineForm wine={wine} action={boundAction} submitLabel="Uložit změny" />
            </div>
        </div>
    );
}
