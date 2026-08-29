import Link from "next/link";
import WineImportForm from "@/app/admin/components/wine-import-form";
import { getWineImportExampleJson, getWineImportPrompt } from "@/app/lib/wine-import";

export default function ImportWinesPage() {
    const prompt = getWineImportPrompt();
    const exampleJson = getWineImportExampleJson();

    return (
        <div>
            <Link href="/admin/vina" className="font-sans text-sm text-black/60 hover:text-black">
                ← Zpět na seznam
            </Link>
            <h1 className="mt-4 font-serif text-2xl text-black md:text-4xl">Import vín</h1>
            <p className="mt-2 max-w-2xl font-sans text-black/60">
                Nahrajte JSON od klienta. Vína se stejným názvem se přeskočí, fotky doplníte později
                v úpravě vína.
            </p>
            <div className="mt-8">
                <WineImportForm prompt={prompt} exampleJson={exampleJson} />
            </div>
        </div>
    );
}
