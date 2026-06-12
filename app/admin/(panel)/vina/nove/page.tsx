import Link from "next/link";
import WineForm from "@/app/admin/components/wine-form";
import { createWineAction } from "@/app/admin/vina/actions";

export default function NewWinePage() {
    return (
        <div>
            <Link href="/admin/vina" className="font-sans text-sm text-black/60 hover:text-black">
                ← Zpět na seznam
            </Link>
            <h1 className="mt-4 font-serif text-2xl text-black md:text-4xl">Nové víno</h1>
            <div className="mt-8">
                <WineForm action={createWineAction} submitLabel="Vytvořit víno" />
            </div>
        </div>
    );
}
