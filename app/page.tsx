import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Footer from "./components/footer";
import Objevte from "./components/objevte";
import WineCarousel from "./components/wine-carousel";
import Filozofie from "./components/filozofie";
import NasVyber from "./components/nas-vyber";

export default function Home() {
    return (
        <div>
            {/* <Navbar /> */}
            <Hero />
            <WineCarousel />
            <Filozofie />
            <Objevte />
            <NasVyber />
            <Footer />
        </div>
    );
}
