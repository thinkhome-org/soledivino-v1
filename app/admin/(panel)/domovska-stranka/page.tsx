import HomepageManager from "@/app/admin/components/homepage-manager";
import { getCarouselRaw, getFeaturedRaw, getProductsRaw } from "@/app/lib/content";

export default async function AdminHomepagePage() {
    const [products, carousel, featured] = await Promise.all([
        getProductsRaw(),
        getCarouselRaw(),
        getFeaturedRaw(),
    ]);

    return (
        <div>
            <h1 className="font-serif text-2xl text-black md:text-4xl">Domovská stránka</h1>
            <p className="mt-2 font-sans text-black/60">
                Správa carouselu a sekce Náš výběr.
            </p>

            <div className="mt-10">
                <HomepageManager
                    products={products}
                    initialCarousel={carousel}
                    initialFeatured={featured}
                />
            </div>
        </div>
    );
}
