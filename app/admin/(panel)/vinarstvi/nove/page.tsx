import Link from "next/link";
import WineryForm from "@/app/admin/components/winery-form";
import { createWineryAction } from "@/app/admin/vinarstvi/actions";
import { getProductsRaw } from "@/app/lib/content";

export default async function NewWineryPage() {
    const products = await getProductsRaw();

    return (
        <div>
            <Link href="/admin/vinarstvi" className="font-sans text-sm text-black/60 hover:text-black">
                ← Zpět na seznam
            </Link>
            <h1 className="mt-4 font-serif text-2xl text-black md:text-4xl">Nové vinařství</h1>
            <div className="mt-8">
                <WineryForm products={products} action={createWineryAction} submitLabel="Vytvořit vinařství" />
            </div>
        </div>
    );
}
