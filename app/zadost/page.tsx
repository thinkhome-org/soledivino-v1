import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ZadostForm from "../components/zadost-form";

export default function ZadostPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-20">
                <h1 className="mb-14 text-center font-serif text-5xl text-black md:text-6xl">Poptávka vín</h1>
                <ZadostForm />
            </main>

            <Footer />
        </div>
    );
}
