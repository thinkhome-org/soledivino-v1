"use server";

import { redirect } from "next/navigation";
import { clearSession } from "@/app/lib/auth";

export async function logoutAction() {
    await clearSession();
    redirect("/admin/login");
}
