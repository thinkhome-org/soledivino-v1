import ItalyMap from "../components/italy-map";
import Navbar from "../components/navbar";
import { getProducts, regionCounts } from "../lib/content";

export default async function MapaPage() {
    const products = await getProducts();
    const counts = regionCounts(products);

    return (
        <div className="min-h-screen bg-[#EFEFEF]">
            <Navbar />

            <main className="mx-auto w-full max-w-7xl px-6 py-12 md:px-12 md:py-16">
                <ItalyMap regionCounts={counts} />
            </main>
        </div>
    );
}
