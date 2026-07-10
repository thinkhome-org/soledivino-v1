"use server";

import { saveInquirySettings } from "@/app/lib/content-actions";
import type { InquirySettings } from "@/app/lib/content-types";

export type InquirySettingsFormState = {
    error?: string;
    success?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function saveInquirySettingsAction(
    _prevState: InquirySettingsFormState,
    formData: FormData,
): Promise<InquirySettingsFormState> {
    const settings: InquirySettings = {
        enabled: formData.get("enabled") === "on",
        recipientEmail: String(formData.get("recipientEmail") ?? "").trim(),
        subject: String(formData.get("subject") ?? "").trim(),
        successMessage: String(formData.get("successMessage") ?? "").trim(),
        disabledMessage: String(formData.get("disabledMessage") ?? "").trim(),
    };

    if (!settings.recipientEmail || !EMAIL_PATTERN.test(settings.recipientEmail)) {
        return { error: "Vyplňte platný e-mail příjemce." };
    }

    if (!settings.subject) {
        return { error: "Vyplňte předmět e-mailu." };
    }

    if (!settings.successMessage || !settings.disabledMessage) {
        return { error: "Vyplňte všechny zprávy." };
    }

    try {
        await saveInquirySettings(settings);
        return { success: "Nastavení poptávky bylo uloženo." };
    } catch {
        return { error: "Uložení se nezdařilo. Zkontrolujte konfiguraci Redis." };
    }
}
