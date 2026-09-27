"use server";

import { redirect } from "next/navigation";
import { saveWineries } from "@/app/lib/content-actions";
import { getProductsRaw, getWineriesRaw } from "@/app/lib/content";
import type { Winery } from "@/app/lib/content-types";
import { newId } from "@/app/lib/content-migrate";
import { findWineBySlug, toWineSlug } from "@/app/lib/wine-slug";
import { parseWineryImportPayload } from "@/app/lib/winery-import";

export type WineryFormState = {
    error?: string;
    success?: string;
};

function parseWineSlugs(formData: FormData, products: { slug: string; name: string }[]): string[] {
    const raw = String(formData.get("wineSlugs") ?? "[]");
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return [];
    }

    if (!Array.isArray(parsed)) return [];

    const slugs: string[] = [];
    const seen = new Set<string>();
    for (const item of parsed) {
        if (typeof item !== "string" || !item.trim()) continue;
        const wine = findWineBySlug(products, item.trim());
        if (!wine || seen.has(wine.slug)) continue;
        seen.add(wine.slug);
        slugs.push(wine.slug);
    }
    return slugs;
}

async function parseWineryForm(formData: FormData, existing?: Winery): Promise<Winery | { error: string }> {
    const name = String(formData.get("name") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const tileImage = String(formData.get("tileImage") ?? "").trim();
    const heroImage = String(formData.get("heroImage") ?? "").trim();
    const logo = String(formData.get("logo") ?? "").trim();

    if (!name || !country || !description || !tileImage || !heroImage) {
        return { error: "Vyplňte všechna povinná pole." };
    }

    const slug = toWineSlug(name);
    if (!slug) {
        return { error: "Z názvu nelze vytvořit adresu stránky." };
    }

    const products = await getProductsRaw();
    const wineSlugs = parseWineSlugs(formData, products);

    return {
        id: existing?.id ?? newId(),
        slug,
        name,
        country,
        description,
        logo: logo || undefined,
        tileImage,
        heroImage,
        wineSlugs,
    };
}

export async function createWineryAction(
    _prevState: WineryFormState,
    formData: FormData,
): Promise<WineryFormState> {
    const parsed = await parseWineryForm(formData);
    if ("error" in parsed) {
        return { error: parsed.error };
    }

    const wineries = await getWineriesRaw();
    if (wineries.some((winery) => winery.slug === parsed.slug)) {
        return { error: "Vinařství s tímto názvem už existuje." };
    }

    await saveWineries([...wineries, parsed]);
    redirect(`/admin/vinarstvi/${parsed.id}?saved=1`);
}

export async function updateWineryAction(
    id: string,
    _prevState: WineryFormState,
    formData: FormData,
): Promise<WineryFormState> {
    const wineries = await getWineriesRaw();
    const existing = wineries.find((winery) => winery.id === id);

    if (!existing) {
        return { error: "Vinařství nebylo nalezeno." };
    }

    const parsed = await parseWineryForm(formData, existing);
    if ("error" in parsed) {
        return { error: parsed.error };
    }

    if (wineries.some((winery) => winery.slug === parsed.slug && winery.id !== id)) {
        return { error: "Vinařství s tímto názvem už existuje." };
    }

    const updated = wineries.map((winery) => (winery.id === id ? parsed : winery));
    await saveWineries(updated);
    return { success: "Změny byly uloženy." };
}

export async function deleteWineryAction(id: string) {
    const wineries = await getWineriesRaw();
    const updated = wineries.filter((winery) => winery.id !== id);
    await saveWineries(updated);
    redirect("/admin/vinarstvi");
}

export type WineryImportState = {
    error?: string;
    success?: string;
    imported?: number;
    skipped?: { index: number; name?: string; message: string }[];
    failed?: { index: number; name?: string; message: string }[];
};

export async function importWineriesAction(
    _prevState: WineryImportState,
    formData: FormData,
): Promise<WineryImportState> {
    const raw = String(formData.get("json") ?? "");
    const [wineries, products] = await Promise.all([getWineriesRaw(), getProductsRaw()]);
    const parsed = parseWineryImportPayload(raw, wineries, products);

    if (!parsed.ok) {
        return { error: parsed.error };
    }

    const changed = JSON.stringify(parsed.wineries) !== JSON.stringify(wineries);
    if (!changed) {
        return {
            error: parsed.failed.length
                ? "Nepodařilo se importovat žádné vinařství."
                : "V souboru nebyla žádná nová ani změněná vinařství.",
            skipped: parsed.skipped,
            failed: parsed.failed,
        };
    }

    await saveWineries(parsed.wineries);

    const existingSlugs = new Set(wineries.map((winery) => winery.slug));
    const imported = parsed.wineries.filter((winery) => {
        const previous = wineries.find((item) => item.slug === winery.slug);
        return !previous || JSON.stringify(previous) !== JSON.stringify(winery);
    }).length;

    const created = parsed.wineries.filter((winery) => !existingSlugs.has(winery.slug)).length;
    const updated = imported - created;
    const parts: string[] = [];
    if (created) {
        parts.push(created === 1 ? "1 nové" : `${created} nových`);
    }
    if (updated) {
        parts.push(updated === 1 ? "1 aktualizované" : `${updated} aktualizovaných`);
    }

    const skippedCount = parsed.skipped.length;
    const failedCount = parsed.failed.length;
    const extra =
        skippedCount || failedCount
            ? ` Přeskočeno ${skippedCount}, s chybami ${failedCount}.`
            : "";

    return {
        success: `Importováno: ${parts.join(", ") || "uloženo"}.${extra}`,
        imported,
        skipped: parsed.skipped,
        failed: parsed.failed,
    };
}
