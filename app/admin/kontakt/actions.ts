"use server";

import { saveContact } from "@/app/lib/content-actions";
import type { Contact } from "@/app/lib/content-types";

export type ContactFormState = {
    error?: string;
    success?: string;
};

export async function saveContactAction(
    _prevState: ContactFormState,
    formData: FormData,
): Promise<ContactFormState> {
    const contact: Contact = {
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        ico: String(formData.get("ico") ?? "").trim(),
    };

    if (!contact.name || !contact.email || !contact.phone || !contact.address || !contact.ico) {
        return { error: "Vyplňte všechna pole." };
    }

    try {
        await saveContact(contact);
        return { success: "Kontaktní údaje byly uloženy." };
    } catch {
        return { error: "Uložení se nezdařilo. Zkontrolujte konfiguraci Redis." };
    }
}
