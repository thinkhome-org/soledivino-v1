"use server";

import { saveCarousel, saveFeatured } from "@/app/lib/content-actions";
import type { CarouselItem, FeaturedItem } from "@/app/lib/content-types";

export type HomepageState = {
    error?: string;
    success?: string;
};

export async function saveCarouselAction(items: CarouselItem[]): Promise<HomepageState> {
    try {
        await saveCarousel(items);
        return { success: "Carousel byl uložen." };
    } catch {
        return { error: "Uložení carouselu se nezdařilo." };
    }
}

export async function saveFeaturedAction(items: FeaturedItem[]): Promise<HomepageState> {
    try {
        await saveFeatured(items);
        return { success: "Náš výběr byl uložen." };
    } catch {
        return { error: "Uložení sekce Náš výběr se nezdařilo." };
    }
}
