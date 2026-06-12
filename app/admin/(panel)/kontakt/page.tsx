import ContactForm from "@/app/admin/components/contact-form";
import { getContactRaw } from "@/app/lib/content";

export default async function AdminContactPage() {
    const contact = await getContactRaw();

    return (
        <div>
            <h1 className="font-serif text-2xl text-black md:text-4xl">Kontakt</h1>
            <p className="mt-2 font-sans text-black/60">
                Údaje zobrazené na stránce Kontakty.
            </p>

            <div className="mt-8">
                <ContactForm contact={contact} />
            </div>
        </div>
    );
}
