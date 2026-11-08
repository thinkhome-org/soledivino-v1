import WineMap from "../components/wine-map";
import Navbar from "../components/navbar";
import { countryRegionCounts, countryWineCounts, getProducts } from "../lib/content";

export default async function MapaPage() {
    const products = await getProducts();
    const regionCountsByCountry = countryRegionCounts(products);
    const countryCounts = countryWineCounts(products);

    return (
        <div className="flex min-h-dvh flex-col bg-[#EFEFEF]">
            <Navbar />

            <main className="mx-auto flex w-full flex-1 flex-col px-4 pb-10 pt-4 sm:px-6 sm:pb-12 md:px-10 md:pb-14 md:pt-6 lg:px-16 lg:pb-16">
                <WineMap
                    regionCountsByCountry={regionCountsByCountry}
                    countryCounts={countryCounts}
                />
            </main>
        </div>
    );
}
