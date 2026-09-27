import Link from "next/link";
import WineryImportForm from "@/app/admin/components/winery-import-form";
import { getWineryImportExampleJson, getWineryImportPrompt } from "@/app/lib/winery-import";

export default function ImportWineriesPage() {
    const prompt = getWineryImportPrompt();
    const exampleJson = getWineryImportExampleJson();

    return (
        <div>
            <Link href="/admin/vinarstvi" className="font-sans text-sm text-black/60 hover:text-black">
                ← Zpět na seznam
            </Link>
            <h1 className="mt-4 font-serif text-2xl text-black md:text-4xl">Import vinařství</h1>
            <p className="mt-2 max-w-2xl font-sans text-black/60">
                Nahrajte JSON. Existující vinařství se stejným slugem se přepíší, nová se přidají.
                Neznámé slugy vín se přeskočí.
            </p>
            <div className="mt-8">
                <WineryImportForm prompt={prompt} exampleJson={exampleJson} />
            </div>
        </div>
    );
}
