"use server";

import { redirect } from "next/navigation";
import { checkAdminCredentials, createSession } from "@/app/lib/auth";

export type LoginState = {
    error?: string;
};

export async function loginAction(
    _prevState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const from = String(formData.get("from") ?? "/admin");

    if (!username || !password) {
        return { error: "Vyplňte uživatelské jméno i heslo." };
    }

    if (!checkAdminCredentials(username, password)) {
        return { error: "Nesprávné přihlašovací údaje." };
    }

    await createSession();
    redirect(from.startsWith("/admin") ? from : "/admin");
}
