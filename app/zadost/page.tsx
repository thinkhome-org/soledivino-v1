import Navbar from "../components/navbar";
import ZadostForm from "../components/zadost-form";
import { getInquirySettings } from "../lib/content";

export default async function ZadostPage() {
    const settings = await getInquirySettings();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-20">
                <h1 className="mb-14 text-center font-serif text-5xl text-black md:text-6xl">Poptávka vín</h1>
                <ZadostForm enabled={settings.enabled} disabledMessage={settings.disabledMessage} />
            </main>
        </div>
    );
}
