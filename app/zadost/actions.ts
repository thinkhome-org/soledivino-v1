"use server";

import { sendInquiryEmail } from "@/app/lib/email";
import { getInquirySettingsRaw } from "@/app/lib/content";

export type InquiryFormState = {
    error?: string;
    success?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseWines(raw: string): string[] {
    if (!raw.trim()) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw) as unknown;

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map((item) => {
                if (typeof item === "string") {
                    return item.trim();
                }

                if (item && typeof item === "object" && "name" in item && typeof item.name === "string") {
                    return item.name.trim();
                }

                return "";
            })
            .filter(Boolean);
    } catch {
        return [];
    }
}

export async function submitInquiryAction(
    _prevState: InquiryFormState,
    formData: FormData,
): Promise<InquiryFormState> {
    const settings = await getInquirySettingsRaw();

    if (!settings.enabled) {
        return { error: settings.disabledMessage };
    }

    if (String(formData.get("website") ?? "").trim()) {
        return { error: "Odeslání se nezdařilo." };
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const wines = parseWines(String(formData.get("wines") ?? ""));

    if (!name) {
        return { error: "Vyplňte prosím jméno." };
    }

    if (!email || !EMAIL_PATTERN.test(email)) {
        return { error: "Vyplňte prosím platný e-mail." };
    }

    try {
        await sendInquiryEmail({
            settings,
            inquiry: { name, email, phone, note, wines },
        });

        return { success: settings.successMessage };
    } catch {
        return { error: "Odeslání se nezdařilo. Zkuste to prosím později." };
    }
}
