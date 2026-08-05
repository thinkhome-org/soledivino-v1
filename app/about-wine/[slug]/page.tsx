import Image from "next/image";
import { notFound } from "next/navigation";
import AddWineButton from "@/app/components/add-wine-button";
import Navbar from "@/app/components/navbar";
import { getProducts } from "@/app/lib/content";
import type { Product } from "@/app/lib/content-types";
import {
    NATURAL_CATEGORY_LABELS,
    PRODUCTION_STYLE_LABELS,
    WINE_TYPE_LABELS,
} from "@/app/lib/content-types";
import { findWineBySlug } from "@/app/lib/wine-slug";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((wine) => ({ slug: wine.slug }));
}

function hasText(value?: string): value is string {
    return Boolean(value?.trim());
}

function StoryBlock({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="font-serif text-sm tracking-[0.12em] text-[#632734] uppercase">{label}</h3>
            <p className="mt-3 font-sans text-base leading-relaxed text-[#1D1D1D]/85 md:text-lg">
                {children}
            </p>
        </div>
    );
}

function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-6 border-b border-[#1D1D1D]/12 py-3 first:pt-0 last:border-b-0 last:pb-0">
            <dt className="shrink-0 font-sans text-sm tracking-wide text-[#1D1D1D]/55 uppercase">
                {label}
            </dt>
            <dd className="text-right font-serif text-lg text-[#1D1D1D] md:text-xl">{value}</dd>
        </div>
    );
}

function wineHasNarrative(wine: Product): boolean {
    return Boolean(
        hasText(wine.aroma) ||
            hasText(wine.tasteProfile) ||
            hasText(wine.finish) ||
            hasText(wine.terroir) ||
            hasText(wine.winemaker) ||
            hasText(wine.productionStyleNote) ||
            wine.productionStyle ||
            wine.naturalCategory ||
            hasText(wine.winemakerPhilosophy) ||
            hasText(wine.emotionalTrace) ||
            hasText(wine.pairing),
    );
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
    const showNarrative = wineHasNarrative(wine);
    const hasSensory = hasText(wine.aroma) || hasText(wine.tasteProfile) || hasText(wine.finish);
    const hasOrigin =
        hasText(wine.terroir) || hasText(wine.winemaker) || hasText(wine.winemakerPhilosophy);
    const hasStyle =
        wine.productionStyle || wine.naturalCategory || hasText(wine.productionStyleNote);
    const hasClosing = hasText(wine.pairing) || hasText(wine.emotionalTrace);

    return (
        <div className="min-h-screen bg-[#EFEFEF]">
            <Navbar />

            <main>
                <section className="relative h-[360px] md:h-[420px]">
                    <div className="hero-bg-in absolute inset-0 overflow-hidden">
                        <Image src="/main-objevte.jpg" alt="Vinice" fill className="object-cover" priority />
                    </div>
                    <div className="absolute inset-0 bg-[#632734]/40" />
                    <div className="absolute bottom-[-32px] left-1/2 h-[330px] w-[230px] -translate-x-1/2 md:bottom-[-70px] md:h-[430px] md:w-[280px]">
                        <div className="panel-image-in relative h-full w-full">
                            <Image
                                src={wine.image}
                                alt={wine.name}
                                fill
                                className="object-contain drop-shadow-2xl"
                                sizes="(max-width: 768px) 230px, 280px"
                                priority
                            />
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-12 pt-24 text-center md:grid-cols-2 md:gap-16 md:px-12 md:pt-28 md:pb-16 md:text-left">
                    <div>
                        <h1 className="panel-text-in-1 break-words font-serif text-4xl text-[#1D1D1D] md:text-6xl">
                            {wine.name}
                        </h1>
                        <p className="panel-text-in-2 mt-2 break-words font-serif text-2xl text-[#1D1D1D] md:text-3xl">
                            {wine.region}
                        </p>
                        <p className="panel-text-in-3 mx-auto mt-8 max-w-[520px] text-lg leading-relaxed text-[#1D1D1D] md:mx-0">
                            {wine.description}
                        </p>

                        {(wine.productionStyle || wine.naturalCategory) && (
                            <div className="panel-text-in-3 mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start">
                                {wine.productionStyle ? (
                                    <span className="font-sans text-sm tracking-[0.08em] text-[#632734] uppercase">
                                        {PRODUCTION_STYLE_LABELS[wine.productionStyle]}
                                    </span>
                                ) : null}
                                {wine.productionStyle && wine.naturalCategory ? (
                                    <span className="text-[#1D1D1D]/25" aria-hidden>
                                        ·
                                    </span>
                                ) : null}
                                {wine.naturalCategory ? (
                                    <span className="font-sans text-sm tracking-[0.08em] text-[#632734] uppercase">
                                        {NATURAL_CATEGORY_LABELS[wine.naturalCategory]}
                                    </span>
                                ) : null}
                            </div>
                        )}

                        <AddWineButton
                            wineName={wine.name}
                            className="panel-text-in-4 mx-auto mt-10 h-12 w-full max-w-[320px] rounded-md text-xl font-semibold md:mx-0"
                        />
                    </div>

                    <dl className="panel-text-in-3 self-center text-left">
                        <SpecRow label="Region" value={regionLabel} />
                        <SpecRow label="Typ" value={typeLabel} />
                        <SpecRow label="Alkohol" value={wine.alcohol} />
                        <SpecRow label="Objem" value={wine.volume} />
                        <SpecRow label="Ročník" value={wine.vintage} />
                    </dl>
                </section>

                {showNarrative ? (
                    <section className="border-t border-[#1D1D1D]/10 bg-[#E8E8E8]/60">
                        <div className="mx-auto w-full max-w-6xl space-y-16 px-6 py-16 md:px-12 md:py-20">
                            {hasSensory ? (
                                <div>
                                    <p className="mb-8 font-serif text-2xl text-[#1D1D1D] md:text-3xl">
                                        Smyslový profil
                                    </p>
                                    <div className="grid gap-10 md:grid-cols-3 md:gap-12">
                                        {hasText(wine.aroma) ? (
                                            <StoryBlock label="Aroma">{wine.aroma}</StoryBlock>
                                        ) : null}
                                        {hasText(wine.tasteProfile) ? (
                                            <StoryBlock label="Chuťový profil">{wine.tasteProfile}</StoryBlock>
                                        ) : null}
                                        {hasText(wine.finish) ? (
                                            <StoryBlock label="Dochuť">{wine.finish}</StoryBlock>
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}

                            {hasOrigin ? (
                                <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                                    {hasText(wine.terroir) ? (
                                        <StoryBlock label="Terroir">{wine.terroir}</StoryBlock>
                                    ) : null}
                                    {hasText(wine.winemaker) ? (
                                        <StoryBlock label="Vinař">{wine.winemaker}</StoryBlock>
                                    ) : null}
                                    {hasText(wine.winemakerPhilosophy) ? (
                                        <div className={hasText(wine.terroir) || hasText(wine.winemaker) ? "md:col-span-2" : ""}>
                                            <StoryBlock label="Filozofie vinaře">
                                                {wine.winemakerPhilosophy}
                                            </StoryBlock>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}

                            {hasStyle && hasText(wine.productionStyleNote) ? (
                                <div className="max-w-3xl">
                                    <StoryBlock
                                        label={
                                            wine.productionStyle
                                                ? `Styl — ${PRODUCTION_STYLE_LABELS[wine.productionStyle]}`
                                                : "Styl"
                                        }
                                    >
                                        {wine.productionStyleNote}
                                    </StoryBlock>
                                </div>
                            ) : null}

                            {hasClosing ? (
                                <div className="grid gap-10 border-t border-[#1D1D1D]/10 pt-12 md:grid-cols-2 md:gap-16">
                                    {hasText(wine.pairing) ? (
                                        <StoryBlock label="Doporučené párování">{wine.pairing}</StoryBlock>
                                    ) : null}
                                    {hasText(wine.emotionalTrace) ? (
                                        <StoryBlock label="Emocionální stopa">{wine.emotionalTrace}</StoryBlock>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </section>
                ) : null}
            </main>
        </div>
    );
}
