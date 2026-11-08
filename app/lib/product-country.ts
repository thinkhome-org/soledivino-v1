import type { Product } from "./content-types";
import {
    COUNTRY_DEFINITIONS,
    COUNTRY_LABELS,
    COUNTRY_ORDER,
    isCountryId,
    toRegionSlug,
    type CountryId,
} from "./regions";

function normalizeKey(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}

const REGION_LOOKUP = Object.fromEntries(
    COUNTRY_ORDER.map((country) => {
        const map = new Map<string, string>();
        for (const region of COUNTRY_DEFINITIONS[country].regions) {
            map.set(normalizeKey(region), region);
            map.set(toRegionSlug(region), region);
        }
        return [country, map];
    }),
) as Record<CountryId, Map<string, string>>;

export function resolveCountryId(value: string | null | undefined): CountryId | null {
    if (!value) return null;
    if (isCountryId(value)) return value;

    const key = normalizeKey(value);
    for (const id of COUNTRY_ORDER) {
        if (normalizeKey(id) === key || normalizeKey(COUNTRY_LABELS[id]) === key) {
            return id;
        }
    }
    return null;
}

export function inferCountryFromRegione(regione: string | null | undefined): CountryId | null {
    if (!regione) return null;
    const key = normalizeKey(regione);
    const slug = toRegionSlug(regione);
    const matches: CountryId[] = [];

    for (const country of COUNTRY_ORDER) {
        const map = REGION_LOOKUP[country];
        if (map.has(key) || map.has(slug)) {
            matches.push(country);
        }
    }

    return matches.length === 1 ? matches[0] : null;
}

export function resolveRegione(country: CountryId, value: string | null | undefined): string | null {
    if (!value) return null;
    const map = REGION_LOOKUP[country];
    return map.get(normalizeKey(value)) ?? map.get(toRegionSlug(value)) ?? null;
}

/** Ensure product.country / regione / region match the Europe registry. */
export function normalizeProduct(product: Product): Product {
    const country =
        resolveCountryId(product.country) ??
        inferCountryFromRegione(product.regione) ??
        "italy";

    const regione =
        resolveRegione(country, product.regione) ??
        COUNTRY_DEFINITIONS[country].regions[0] ??
        product.regione;

    const region = product.region?.trim() || COUNTRY_LABELS[country];

    return {
        ...product,
        country,
        regione,
        region,
    };
}

export function normalizeProducts(products: Product[]): Product[] {
    return products.map(normalizeProduct);
}
