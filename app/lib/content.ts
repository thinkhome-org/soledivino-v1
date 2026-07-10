import { unstable_cache } from "next/cache";
import {
    defaultCarousel,
    defaultContact,
    defaultFeatured,
    defaultInquirySettings,
    defaultProducts,
} from "./content-migrate";
import type { CarouselItem, Contact, FeaturedItem, InquirySettings, Product } from "./content-types";
import { devRead, devWrite, isDevStorageEnabled } from "./dev-storage";
import { getRedis } from "./redis";
import { toRegionSlug } from "./regions";
import { findWineBySlug } from "./wine-slug";

const KEYS = {
    products: "content:products",
    carousel: "content:carousel",
    featured: "content:featured",
    contact: "content:contact",
    inquirySettings: "content:inquiry-settings",
} as const;

async function readJson<T>(key: string): Promise<T | null> {
    const redis = getRedis();

    if (redis) {
        try {
            return await redis.get<T>(key);
        } catch {
            return null;
        }
    }

    if (isDevStorageEnabled()) {
        return devRead<T>(key);
    }

    return null;
}

async function writeJson(key: string, value: unknown): Promise<void> {
    const redis = getRedis();

    if (redis) {
        await redis.set(key, value);
        return;
    }

    if (isDevStorageEnabled()) {
        await devWrite(key, value);
        return;
    }

    throw new Error(
        "Redis není nakonfigurován. Připojte Upstash/KV úložiště ve Vercelu (KV_REST_API_URL + KV_REST_API_TOKEN).",
    );
}

async function fetchProducts(): Promise<Product[]> {
    const stored = await readJson<Product[]>(KEYS.products);
    return stored ?? defaultProducts();
}

async function fetchCarousel(): Promise<CarouselItem[]> {
    const stored = await readJson<CarouselItem[]>(KEYS.carousel);
    return stored ?? defaultCarousel();
}

async function fetchFeatured(): Promise<FeaturedItem[]> {
    const stored = await readJson<FeaturedItem[]>(KEYS.featured);
    return stored ?? defaultFeatured();
}

async function fetchContact(): Promise<Contact> {
    const stored = await readJson<Contact>(KEYS.contact);
    return stored ?? defaultContact();
}

async function fetchInquirySettings(): Promise<InquirySettings> {
    const stored = await readJson<InquirySettings>(KEYS.inquirySettings);
    return stored ?? defaultInquirySettings();
}

export const getProducts = unstable_cache(fetchProducts, ["content-products"], {
    tags: ["content"],
});

export const getCarousel = unstable_cache(fetchCarousel, ["content-carousel"], {
    tags: ["content"],
});

export const getFeatured = unstable_cache(fetchFeatured, ["content-featured"], {
    tags: ["content"],
});

export const getContact = unstable_cache(fetchContact, ["content-contact"], {
    tags: ["content"],
});

export const getInquirySettings = unstable_cache(fetchInquirySettings, ["content-inquiry-settings"], {
    tags: ["content"],
});

export async function getProductsRaw(): Promise<Product[]> {
    return fetchProducts();
}

export async function getCarouselRaw(): Promise<CarouselItem[]> {
    return fetchCarousel();
}

export async function getFeaturedRaw(): Promise<FeaturedItem[]> {
    return fetchFeatured();
}

export async function getContactRaw(): Promise<Contact> {
    return fetchContact();
}

export async function getInquirySettingsRaw(): Promise<InquirySettings> {
    return fetchInquirySettings();
}

export async function writeProducts(products: Product[]): Promise<void> {
    await writeJson(KEYS.products, products);
}

export async function writeCarousel(items: CarouselItem[]): Promise<void> {
    await writeJson(KEYS.carousel, items);
}

export async function writeFeatured(items: FeaturedItem[]): Promise<void> {
    await writeJson(KEYS.featured, items);
}

export async function writeContact(contact: Contact): Promise<void> {
    await writeJson(KEYS.contact, contact);
}

export async function writeInquirySettings(settings: InquirySettings): Promise<void> {
    await writeJson(KEYS.inquirySettings, settings);
}

export function productById(products: Product[], id: string): Product | undefined {
    return products.find((product) => product.id === id);
}

export function productBySlug(products: Product[], slug: string): Product | undefined {
    return findWineBySlug(products, slug);
}

export function regionCounts(products: Product[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const wine of products) {
        const slug = toRegionSlug(wine.regione);
        counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
}
