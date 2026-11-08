import { toWineSlug } from "./wine-slug";
import europeRegistryJson from "@/app/data/europe-registry.json";
import europeCountriesPathsJson from "@/app/data/europe-countries-paths.json";

export type RegionPath = { id: string; d: string };

export type EuropeCountriesData = {
    viewBox: string;
    paths: RegionPath[];
};

type RegistryEntry = {
    id: string;
    iso2: string;
    labelCs: string;
    viewBox: string;
    idToRegion: Record<string, string>;
};

const REGISTRY = europeRegistryJson as unknown as RegistryEntry[];

/** All map countries (Europe SVG, without Turkey/Russia). */
export const COUNTRY_ORDER = REGISTRY.map((entry) => entry.id) as CountryId[];

export type CountryId = (typeof REGISTRY)[number]["id"];

export type CountryDefinition = {
    id: CountryId;
    iso2: string;
    labelCs: string;
    viewBox: string;
    idToRegion: Record<string, string>;
    regions: string[];
};

const COUNTRY_ID_SET = new Set<string>(COUNTRY_ORDER);

export const COUNTRY_DEFINITIONS: Record<CountryId, CountryDefinition> = Object.fromEntries(
    REGISTRY.map((entry) => {
        const id = entry.id as CountryId;
        const def: CountryDefinition = {
            id,
            iso2: entry.iso2,
            labelCs: entry.labelCs,
            viewBox: entry.viewBox,
            idToRegion: entry.idToRegion,
            regions: Object.values(entry.idToRegion),
        };
        return [id, def];
    }),
) as Record<CountryId, CountryDefinition>;

export const COUNTRY_LABELS: Record<CountryId, string> = Object.fromEntries(
    REGISTRY.map((entry) => [entry.id, entry.labelCs]),
) as Record<CountryId, string>;

export const ISO2_TO_COUNTRY_ID: Record<string, CountryId> = Object.fromEntries(
    REGISTRY.map((entry) => [entry.iso2, entry.id as CountryId]),
);

export const COUNTRY_ID_TO_ISO2: Record<CountryId, string> = Object.fromEntries(
    REGISTRY.map((entry) => [entry.id, entry.iso2]),
) as Record<CountryId, string>;

export const EUROPE_COUNTRIES = europeCountriesPathsJson as EuropeCountriesData;

const regionPathLoaders: Record<CountryId, () => Promise<RegionPath[]>> = Object.fromEntries(
    COUNTRY_ORDER.map((id) => [
        id,
        async () => {
            const mod = await import(`@/app/data/regions/${id}-regions-paths.json`);
            return (mod.default ?? mod) as RegionPath[];
        },
    ]),
) as Record<CountryId, () => Promise<RegionPath[]>>;

const regionPathCache = new Map<CountryId, RegionPath[]>();

export async function loadCountryRegionPaths(country: CountryId): Promise<RegionPath[]> {
    const cached = regionPathCache.get(country);
    if (cached) {
        return cached;
    }

    const loader = regionPathLoaders[country];
    if (!loader) {
        return [];
    }

    const paths = await loader();
    regionPathCache.set(country, paths);
    return paths;
}

export function toRegionSlug(name: string): string {
    return toWineSlug(name);
}

export function isCountryId(value: string | null | undefined): value is CountryId {
    return typeof value === "string" && COUNTRY_ID_SET.has(value);
}

export function parseCountryId(value: string | null | undefined): CountryId | null {
    return isCountryId(value) ? value : null;
}

export function parseCountryIdFromIso2(iso2: string | null | undefined): CountryId | null {
    if (!iso2) {
        return null;
    }
    return ISO2_TO_COUNTRY_ID[iso2] ?? null;
}

/** Resolve display name for a region slug within a country. */
export function regionLabelForSlug(country: CountryId, slug: string): string | null {
    const def = COUNTRY_DEFINITIONS[country];
    for (const name of def.regions) {
        if (toRegionSlug(name) === slug) {
            return name;
        }
    }
    return null;
}

/** @deprecated Use COUNTRY_DEFINITIONS.italy.idToRegion */
export const SVG_ID_TO_REGION: Record<string, string> = COUNTRY_DEFINITIONS.italy?.idToRegion ?? {};
