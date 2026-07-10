import Image from "next/image";
import { notFound } from "next/navigation";
import AddWineButton from "@/app/components/add-wine-button";
import Navbar from "@/app/components/navbar";
import { getProducts } from "@/app/lib/content";
import { WINE_TYPE_LABELS } from "@/app/lib/content-types";
import { findWineBySlug } from "@/app/lib/wine-slug";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((wine) => ({ slug: wine.slug }));
}

export default async function WineDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const products = await getProducts();
    const wine = findWineBySlug(products, slug);

    if (!wine) {
        notFound();
    }

    const regionLabel = wine.name === "Barolo Bussia" ? "Piemonte - Bussia" : wine.region;
    const typeLabel = WINE_TYPE_LABELS[wine.type];

    return (
        <div className="min-h-screen bg-[#EFEFEF]">
            <Navbar />

            <div>
                <main>
                    <section className="relative h-[360px] md:h-[420px]">
                        <div className="hero-bg-in absolute inset-0 overflow-hidden">
                            <Image src="/main-objevte.jpg" alt="Vinice" fill className="object-cover" priority />
                        </div>
                        <div className="absolute inset-0 bg-[#632734]/40" />
                        <div className="absolute bottom-[-32px] left-1/2 h-[330px] w-[230px] -translate-x-1/2 md:bottom-[-70px] md:h-[430px] md:w-[280px]">
                            <div className="panel-image-in relative h-full w-full">
                                <Image src={wine.image} alt={wine.name} fill className="object-contain drop-shadow-2xl" sizes="(max-width: 768px) 230px, 280px" priority />
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-24 text-center md:grid-cols-2 md:gap-16 md:px-12 md:pt-28 md:text-left">
                        <div>
                            <h1 className="panel-text-in-1 break-words font-serif text-4xl text-[#1D1D1D] md:text-6xl">{wine.name}</h1>
                            <p className="panel-text-in-2 mt-2 break-words font-serif text-2xl text-[#1D1D1D] md:text-3xl">{wine.region}</p>
                            <p className="panel-text-in-3 mx-auto mt-8 max-w-[520px] text-lg leading-relaxed text-[#1D1D1D] md:mx-0">{wine.description}</p>

                            <AddWineButton wineName={wine.name} className="panel-text-in-4 mx-auto mt-10 h-12 w-full max-w-[320px] rounded-md text-xl font-semibold md:mx-0" />
                        </div>

                        <div className="panel-text-in-3 self-center break-words text-xl leading-[1.35] text-[#1D1D1D] md:text-4xl lg:text-5xl">
                            <p>
                                <strong>Region:</strong> {regionLabel}
                            </p>
                            <p>
                                <strong>Typ:</strong> {typeLabel}
                            </p>
                            <p>
                                <strong>Alkohol:</strong> {wine.alcohol}
                            </p>
                            <p>
                                <strong>Objem:</strong> {wine.volume}
                            </p>
                            <p>
                                <strong>Ročník:</strong> {wine.vintage}
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
