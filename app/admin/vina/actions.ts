"use server";

import { redirect } from "next/navigation";
import { saveProducts } from "@/app/lib/content-actions";
import type { Product, WineType } from "@/app/lib/content-types";
import { newId } from "@/app/lib/content-migrate";
import { getProductsRaw } from "@/app/lib/content";
import { toWineSlug } from "@/app/lib/wine-slug";

export type WineFormState = {
    error?: string;
    success?: string;
};

function parseWineForm(formData: FormData, existing?: Product): Product | null {
    const name = String(formData.get("name") ?? "").trim();
    const region = String(formData.get("region") ?? "").trim();
    const regione = String(formData.get("regione") ?? "").trim();
    const type = String(formData.get("type") ?? "") as WineType;
    const color = String(formData.get("color") ?? "").trim();
    const alcohol = String(formData.get("alcohol") ?? "").trim();
    const volume = String(formData.get("volume") ?? "").trim();
    const vintage = String(formData.get("vintage") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();

    if (!name || !region || !regione || !type || !color || !image || !description) {
        return null;
    }

    return {
        id: existing?.id ?? newId(),
        slug: toWineSlug(name),
        name,
        region,
        regione,
        type,
        color,
        image,
        description,
        alcohol: alcohol || "xx%",
        volume: volume || "0.75l",
        vintage: vintage || "2020",
    };
}

export async function createWineAction(
    _prevState: WineFormState,
    formData: FormData,
): Promise<WineFormState> {
    const wine = parseWineForm(formData);
    if (!wine) {
        return { error: "Vyplňte všechna povinná pole." };
    }

    const products = await getProductsRaw();
    await saveProducts([...products, wine]);
    redirect(`/admin/vina/${wine.id}?saved=1`);
}

export async function updateWineAction(
    id: string,
    _prevState: WineFormState,
    formData: FormData,
): Promise<WineFormState> {
    const products = await getProductsRaw();
    const existing = products.find((product) => product.id === id);

    if (!existing) {
        return { error: "Víno nebylo nalezeno." };
    }

    const wine = parseWineForm(formData, existing);
    if (!wine) {
        return { error: "Vyplňte všechna povinná pole." };
    }

    const updated = products.map((product) => (product.id === id ? wine : product));
    await saveProducts(updated);
    return { success: "Změny byly uloženy." };
}

export async function deleteWineAction(id: string) {
    const products = await getProductsRaw();
    const updated = products.filter((product) => product.id !== id);
    await saveProducts(updated);
    redirect("/admin/vina");
}
