import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/navbar";
import { getProducts, getWineries, wineryBySlug, winesForWinery } from "@/app/lib/content";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
    const wineries = await getWineries();
    return wineries.map((winery) => ({ slug: winery.slug }));
}

function chunkWines<T>(items: T[], size: number): T[][] {
    const rows: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        rows.push(items.slice(i, i + size));
    }
    return rows;
}

export default async function WineryDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const [wineries, products] = await Promise.all([getWineries(), getProducts()]);
    const winery = wineryBySlug(wineries, slug);

    if (!winery) {
        notFound();
    }

    const wines = winesForWinery(winery, products);
    const rows = chunkWines(wines, 3);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                <section className="relative h-[min(52vh,560px)] min-h-[240px] w-full overflow-hidden bg-[#1D1D1D]">
                    <Image
                        src={winery.heroImage}
                        alt=""
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                </section>

                <section className="mx-auto max-w-3xl px-6 py-16 text-center md:px-12 md:py-20">
                    <h1 className="font-serif text-4xl text-[#1D1D1D] md:text-6xl">{winery.name}</h1>
                    <p className="mt-3 font-sans text-base text-[#1D1D1D]/55 md:text-lg">{winery.country}</p>
                    <p className="mx-auto mt-8 max-w-xl font-sans text-base leading-relaxed text-[#1D1D1D]/80 md:text-lg">
                        {winery.description}
                    </p>
                </section>

                <section className="pb-20">
                    <h2 className="mb-10 text-center font-serif text-3xl text-[#1D1D1D] md:text-4xl">
                        Vína od vinařství
                    </h2>

                    {wines.length === 0 ? (
                        <p className="px-6 text-center font-sans text-[#1D1D1D]/60">
                            K tomuto vinařství zatím nejsou přiřazena žádná vína.
                        </p>
                    ) : (
                        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
                            {rows.map((row, rowIndex) => {
                                const rowGridClass =
                                    row.length === 1
                                        ? "md:grid-cols-1"
                                        : row.length === 2
                                          ? "md:grid-cols-2"
                                          : "md:grid-cols-3";

                                return (
                                    <div key={`row-${rowIndex}`} className="grid grid-cols-1 gap-0">
                                        <div className={`grid grid-cols-1 gap-0 ${rowGridClass}`}>
                                            {row.map((wine) => (
                                                <Link
                                                    key={wine.id}
                                                    href={`/about-wine/${wine.slug}`}
                                                    className="group relative isolate block h-full w-full overflow-hidden px-4 py-8 text-center"
                                                >
                                                    <div
                                                        className="absolute inset-0 -z-10 hidden origin-top scale-y-0 md:block md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:scale-y-100"
                                                        style={{ backgroundColor: wine.color }}
                                                    />
                                                    <div className="relative mx-auto h-[220px] w-full max-w-[300px] md:h-[300px] md:w-[300px]">
                                                        <Image
                                                            src={wine.image}
                                                            alt={wine.name}
                                                            fill
                                                            className="object-contain"
                                                            sizes="300px"
                                                        />
                                                    </div>
                                                    <h3 className="mt-4 break-words font-serif text-xl leading-[1.05] text-[#1D1D1D] md:text-[24px] md:transition-colors md:duration-500 md:group-hover:text-white">
                                                        {wine.name}
                                                    </h3>
                                                    <p className="mx-auto mt-2 max-w-[260px] line-clamp-3 font-sans text-sm leading-relaxed text-[#1D1D1D]/70 md:transition-colors md:duration-500 md:group-hover:text-white/90">
                                                        {wine.description}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
