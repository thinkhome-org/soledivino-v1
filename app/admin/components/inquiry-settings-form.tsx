"use client";

import { useActionState } from "react";
import { Button } from "@/app/components/button";
import type { InquirySettings } from "@/app/lib/content-types";
import { saveInquirySettingsAction, type InquirySettingsFormState } from "../poptavka/actions";

const initialState: InquirySettingsFormState = {};

const inputClassName =
    "w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40";

export default function InquirySettingsForm({ settings }: { settings: InquirySettings }) {
    const [state, formAction, pending] = useActionState(saveInquirySettingsAction, initialState);

    return (
        <form action={formAction} className="max-w-2xl space-y-6">
            <div className="rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 font-sans text-sm text-black/70">
                Odesílání e-mailů vyžaduje proměnné prostředí{" "}
                <code className="rounded bg-black/5 px-1.5 py-0.5">RESEND_API_KEY</code> a{" "}
                <code className="rounded bg-black/5 px-1.5 py-0.5">RESEND_FROM_EMAIL</code> nastavené ve Vercelu.
            </div>

            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    name="enabled"
                    defaultChecked={settings.enabled}
                    className="h-4 w-4 rounded border-black/30"
                />
                <span className="font-sans text-sm text-black/80">Přijímat poptávky (formulář zapnutý)</span>
            </label>

            <div>
                <label className="mb-1.5 block font-sans text-sm text-black/70">Příjemce (e-mail) *</label>
                <input
                    name="recipientEmail"
                    type="email"
                    defaultValue={settings.recipientEmail}
                    required
                    className={inputClassName}
                />
            </div>

            <div>
                <label className="mb-1.5 block font-sans text-sm text-black/70">Předmět e-mailu *</label>
                <input name="subject" defaultValue={settings.subject} required className={inputClassName} />
            </div>

            <div>
                <label className="mb-1.5 block font-sans text-sm text-black/70">Zpráva po odeslání *</label>
                <textarea
                    name="successMessage"
                    defaultValue={settings.successMessage}
                    required
                    rows={2}
                    className={`${inputClassName} resize-y`}
                />
            </div>

            <div>
                <label className="mb-1.5 block font-sans text-sm text-black/70">Zpráva při vypnutí *</label>
                <textarea
                    name="disabledMessage"
                    defaultValue={settings.disabledMessage}
                    required
                    rows={2}
                    className={`${inputClassName} resize-y`}
                />
            </div>

            {state.error ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">{state.error}</p>
            ) : null}

            {state.success ? (
                <p className="rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">{state.success}</p>
            ) : null}

            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
                {pending ? "Ukládám…" : "Uložit nastavení"}
            </Button>
        </form>
    );
}
