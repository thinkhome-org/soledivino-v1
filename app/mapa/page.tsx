import ItalyMap from "../components/italy-map";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function MapaPage() {
    return (
        <div className="min-h-screen bg-[#EFEFEF]">
            <Navbar />

            <main className="mx-auto w-full max-w-7xl px-6 py-12 md:px-12 md:py-16">
                <ItalyMap />
            </main>

            <Footer />
        </div>
    );
}
