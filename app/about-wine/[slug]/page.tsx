import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import winesData from "@/app/data/products-wines.json";
import { toWineSlug } from "@/app/lib/wine-slug";

type ProductWine = {
    name: string;
    region: string;
    color: string;
    image: string;
    description: string;
};

type WineDetails = {
    regionLabel: string;
    typeLabel: string;
    alcohol: string;
    volume: string;
    vintage: string;
};

const wines: ProductWine[] = winesData;

function getWineDetails(wine: ProductWine): WineDetails {
    const lowerName = wine.name.toLowerCase();
    const isRose = lowerName.includes("rosato");
    const isWhite =
        lowerName.includes("soave") ||
        lowerName.includes("falanghina") ||
        lowerName.includes("vermentino") ||
        lowerName.includes("greco") ||
        lowerName.includes("lugana");

    return {
        regionLabel: wine.name === "Barolo Bussia" ? "Piemonte - Bussia" : wine.region,
        typeLabel: isRose ? "Růžové víno" : isWhite ? "Bílé víno" : "Červené víno",
        alcohol: "xx%",
        volume: "0.75l",
        vintage: "2020",
    };
}

export function generateStaticParams() {
    return wines.map((wine) => ({ slug: toWineSlug(wine.name) }));
}

export default async function WineDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const wine = wines.find((item) => toWineSlug(item.name) === slug);

    if (!wine) {
        notFound();
    }

    const details = getWineDetails(wine);

    return (
        <div className="min-h-screen bg-[#EFEFEF]">
            <Navbar />

            <div>
                <main>
                    <section className="relative h-[360px] overflow-hidden md:h-[420px]">
                        <div className="hero-bg-in absolute inset-0">
                            <Image src="/main-objevte.jpg" alt="Vinice" fill className="object-cover" priority />
                        </div>
                        <div className="absolute inset-0 bg-[#632734]/40" />
                        <div className="panel-image-in absolute bottom-[-70px] left-1/2 h-[390px] w-[260px] -translate-x-1/2 md:h-[430px] md:w-[280px]">
                            <Image src={wine.image} alt={wine.name} fill className="object-contain drop-shadow-2xl" sizes="280px" priority />
                        </div>
                    </section>

                    <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-28 md:grid-cols-2 md:gap-16 md:px-12">
                        <div>
                            <h1 className="panel-text-in-1 font-serif text-5xl text-[#1D1D1D] md:text-6xl">{wine.name}</h1>
                            <p className="panel-text-in-2 mt-2 font-serif text-3xl text-[#1D1D1D]">{wine.region}</p>
                            <p className="panel-text-in-3 mt-8 max-w-[520px] text-lg leading-relaxed text-[#1D1D1D]">{wine.description}</p>

                            <button
                                type="button"
                                className="panel-text-in-4 mt-10 h-12 w-full max-w-[320px] rounded-md bg-black text-xl font-semibold text-white transition-colors hover:bg-black/90"
                            >
                                Přidat
                            </button>
                        </div>

                        <div className="panel-text-in-3 self-center text-4xl leading-[1.35] text-[#1D1D1D] md:text-5xl">
                            <p>
                                <strong>Region:</strong> {details.regionLabel}
                            </p>
                            <p>
                                <strong>Typ:</strong> {details.typeLabel}
                            </p>
                            <p>
                                <strong>Alkohol:</strong> {details.alcohol}
                            </p>
                            <p>
                                <strong>Objem:</strong> {details.volume}
                            </p>
                            <p>
                                <strong>Ročník:</strong> {details.vintage}
                            </p>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    );
}
