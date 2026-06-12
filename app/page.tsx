import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Objevte from "./components/objevte";
import WineCarousel from "./components/wine-carousel";
import Filozofie from "./components/filozofie";
import NasVyber from "./components/nas-vyber";
import { getCarousel, getFeatured } from "./lib/content";

export default async function Home() {
    const [carousel, featured] = await Promise.all([getCarousel(), getFeatured()]);

    return (
        <div>
            <Navbar />
            <Hero />
            <WineCarousel items={carousel} />
            <Filozofie />
            <Objevte />
            <NasVyber items={featured} />
        </div>
    );
}
