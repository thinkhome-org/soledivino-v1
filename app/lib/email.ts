import { Resend } from "resend";
import type { InquirySettings } from "./content-types";

export type InquiryPayload = {
    name: string;
    email: string;
    phone: string;
    note: string;
    wines: string[];
};

function getResendClient(): Resend {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error("RESEND_API_KEY není nastaven.");
    }

    return new Resend(apiKey);
}

function getFromEmail(): string {
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!fromEmail) {
        throw new Error("RESEND_FROM_EMAIL není nastaven.");
    }

    return fromEmail;
}

function buildEmailBody(inquiry: InquiryPayload): string {
    const winesList =
        inquiry.wines.length > 0 ? inquiry.wines.map((wine) => `  - ${wine}`).join("\n") : "  (žádná)";

    return [
        "Nová poptávka vín z webu Soledivino",
        "",
        `Jméno: ${inquiry.name}`,
        `E-mail: ${inquiry.email}`,
        `Telefon: ${inquiry.phone || "—"}`,
        "",
        "Poznámka:",
        inquiry.note || "—",
        "",
        "Vybraná vína:",
        winesList,
    ].join("\n");
}

export async function sendInquiryEmail({
    settings,
    inquiry,
}: {
    settings: InquirySettings;
    inquiry: InquiryPayload;
}): Promise<void> {
    const resend = getResendClient();
    const from = getFromEmail();

    const { error } = await resend.emails.send({
        from,
        to: settings.recipientEmail,
        replyTo: inquiry.email,
        subject: settings.subject,
        text: buildEmailBody(inquiry),
    });

    if (error) {
        throw new Error(error.message);
    }
}
