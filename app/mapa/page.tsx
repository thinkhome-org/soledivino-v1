import WineMap from "../components/wine-map";
import Navbar from "../components/navbar";
import { countryRegionCounts, countryWineCounts, getProducts } from "../lib/content";

export default async function MapaPage() {
    const products = await getProducts();
    const regionCountsByCountry = countryRegionCounts(products);
    const countryCounts = countryWineCounts(products);

    return (
        <div className="flex min-h-screen flex-col bg-[#EFEFEF]">
            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-8 md:px-8 md:py-10">
                <WineMap
                    regionCountsByCountry={regionCountsByCountry}
                    countryCounts={countryCounts}
                />
            </main>
        </div>
    );
}
