import InquirySettingsForm from "@/app/admin/components/inquiry-settings-form";
import { getInquirySettingsRaw } from "@/app/lib/content";

export default async function AdminInquiryPage() {
    const settings = await getInquirySettingsRaw();

    return (
        <div>
            <h1 className="font-serif text-2xl text-black md:text-4xl">Poptávka</h1>
            <p className="mt-2 font-sans text-black/60">
                Nastavení formuláře na stránce Poptávka vín a doručení e-mailů.
            </p>

            <div className="mt-8">
                <InquirySettingsForm settings={settings} />
            </div>
        </div>
    );
}
