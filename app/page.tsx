import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Objevte from "./components/objevte";
import WineCarousel from "./components/wine-carousel";
import Filozofie from "./components/filozofie";
import NasVyber from "./components/nas-vyber";
import { getCarousel, getFeatured, getProducts } from "./lib/content";

export default async function Home() {
    const [carousel, featured, products] = await Promise.all([
        getCarousel(),
        getFeatured(),
        getProducts(),
    ]);

    const featuredItems = featured.map((item) => ({
        ...item,
        color: products.find((product) => product.slug === item.productSlug)?.color ?? "#8B2D3D",
    }));

    return (
        <div>
            <Navbar />
            <Hero />
            <WineCarousel items={carousel} />
            <Filozofie />
            <Objevte />
            <NasVyber items={featuredItems} />
        </div>
    );
}
