import WineMap from "../components/wine-map";
import Navbar from "../components/navbar";
import { countryRegionCounts, countryWineCounts, getProducts } from "../lib/content";

export default async function MapaPage() {
    const products = await getProducts();
    const regionCountsByCountry = countryRegionCounts(products);
    const countryCounts = countryWineCounts(products);

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-[#EFEFEF]">
            <Navbar />

            <main className="mx-auto flex min-h-0 w-full flex-1 flex-col px-5 pb-12 pt-5 sm:px-8 sm:pb-14 md:px-12 md:pb-16 md:pt-6 lg:px-20 lg:pb-20">
                <WineMap
                    regionCountsByCountry={regionCountsByCountry}
                    countryCounts={countryCounts}
                />
            </main>
        </div>
    );
}
