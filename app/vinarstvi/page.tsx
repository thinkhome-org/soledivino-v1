import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/navbar";
import { getWineries } from "@/app/lib/content";

export default async function WineriesPage() {
    const wineries = await getWineries();

    return (
        <div className="min-h-screen bg-black">
            <Navbar />

            {wineries.length === 0 ? (
                <main className="bg-[#EFEFEF] px-6 py-24 text-center">
                    <p className="font-sans text-[#1D1D1D]/70">Zatím tu nemáme žádná vinařství.</p>
                </main>
            ) : (
                <main className="grid grid-cols-2 gap-px bg-black md:grid-cols-3">
                    {wineries.map((winery, index) => (
                        <Link
                            key={winery.id}
                            href={`/vinarstvi/${winery.slug}`}
                            className="group relative isolate block aspect-square overflow-hidden bg-[#1D1D1D]"
                        >
                            <Image
                                src={winery.tileImage}
                                alt=""
                                fill
                                priority={index < 3}
                                className="object-cover grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/10" />
                            <div className="absolute inset-0 flex items-center justify-center px-4 md:px-6">
                                {winery.logo ? (
                                    <Image
                                        src={winery.logo}
                                        alt={winery.name}
                                        width={220}
                                        height={90}
                                        className="h-auto max-h-14 w-auto max-w-[72%] object-contain drop-shadow-md md:max-h-16"
                                    />
                                ) : (
                                    <span className="text-center font-serif text-2xl leading-tight text-white drop-shadow-md md:text-3xl">
                                        {winery.name}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </main>
            )}
        </div>
    );
}
