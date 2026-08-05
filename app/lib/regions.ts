import { toWineSlug } from "./wine-slug";
import italyPaths from "@/app/data/italy-regions-paths.json";
import germanyPaths from "@/app/data/germany-regions-paths.json";
import austriaPaths from "@/app/data/austria-regions-paths.json";
import francePaths from "@/app/data/france-regions-paths.json";
import countriesOutlines from "@/app/data/countries-outlines.json";

export type CountryId = "italy" | "germany" | "austria" | "france";

export type RegionPath = { id: string; d: string };

export type CountryOutline = {
    id: CountryId;
    viewBox: string;
    paths: RegionPath[];
};

export function toRegionSlug(name: string): string {
    return toWineSlug(name);
}

/** @deprecated Use COUNTRY_DEFINITIONS.italy.idToRegion — kept for any leftover imports */
export const SVG_ID_TO_REGION: Record<string, string> = {
    IT21: "Piemonte",
    IT23: "Valle d'Aosta",
    IT42: "Liguria",
    IT25: "Lombardia",
    IT32: "Trentino-Alto Adige",
    IT34: "Veneto",
    IT36: "Friuli-Venezia Giulia",
    IT45: "Emilia-Romagna",
    IT52: "Toscana",
    IT55: "Umbria",
    IT57: "Marche",
    IT62: "Lazio",
    IT65: "Abruzzo",
    IT67: "Molise",
    IT72: "Campania",
    IT75: "Puglia",
    IT77: "Basilicata",
    IT78: "Calabria",
    IT82: "Sicilia",
    IT88: "Sardegna",
};

const GERMANY_ID_TO_REGION: Record<string, string> = {
    DESN: "Sachsen",
    DEBY: "Bayern",
    DERP: "Rheinland-Pfalz",
    DESL: "Saarland",
    DESH: "Schleswig-Holstein",
    DENI: "Niedersachsen",
    DENW: "Nordrhein-Westfalen",
    DEBW: "Baden-Württemberg",
    DEBB: "Brandenburg",
    DEMV: "Mecklenburg-Vorpommern",
    DEHB: "Bremen",
    DEHH: "Hamburg",
    DEHE: "Hessen",
    DETH: "Thüringen",
    DEST: "Sachsen-Anhalt",
    DEBE: "Berlin",
};

const AUSTRIA_ID_TO_REGION: Record<string, string> = {
    AT3: "Niederösterreich",
    AT4: "Oberösterreich",
    AT1: "Burgenland",
    AT8: "Vorarlberg",
    AT7: "Tirol",
    AT5: "Salzburg",
    AT2: "Kärnten",
    AT6: "Steiermark",
    AT9: "Wien",
};

const FRANCE_ID_TO_REGION: Record<string, string> = {
    FRHDF: "Hauts-de-France",
    FRGES: "Grand Est",
    FRPAC: "Provence-Alpes-Côte d'Azur",
    FRARA: "Auvergne-Rhône-Alpes",
    FRBFC: "Bourgogne-Franche-Comté",
    FROCC: "Occitanie",
    FRPDL: "Pays de la Loire",
    FRBRE: "Bretagne",
    FRNOR: "Normandie",
    FR20R: "Corse",
    FRNAQ: "Nouvelle-Aquitaine",
    FRCVL: "Centre-Val de Loire",
    FRIDF: "Île-de-France",
};

export type CountryDefinition = {
    id: CountryId;
    labelCs: string;
    viewBox: string;
    paths: RegionPath[];
    idToRegion: Record<string, string>;
    regions: string[];
};

export const COUNTRY_ORDER: CountryId[] = ["italy", "germany", "austria", "france"];

export const COUNTRY_DEFINITIONS: Record<CountryId, CountryDefinition> = {
    italy: {
        id: "italy",
        labelCs: "Itálie",
        viewBox: "0 0 1000 1000",
        paths: italyPaths as RegionPath[],
        idToRegion: SVG_ID_TO_REGION,
        regions: Object.values(SVG_ID_TO_REGION),
    },
    germany: {
        id: "germany",
        labelCs: "Německo",
        viewBox: "0 0 1000 1000",
        paths: germanyPaths as RegionPath[],
        idToRegion: GERMANY_ID_TO_REGION,
        regions: Object.values(GERMANY_ID_TO_REGION),
    },
    austria: {
        id: "austria",
        labelCs: "Rakousko",
        viewBox: "0 0 1000 1000",
        paths: austriaPaths as RegionPath[],
        idToRegion: AUSTRIA_ID_TO_REGION,
        regions: Object.values(AUSTRIA_ID_TO_REGION),
    },
    france: {
        id: "france",
        labelCs: "Francie",
        viewBox: "0 0 1000 1000",
        paths: francePaths as RegionPath[],
        idToRegion: FRANCE_ID_TO_REGION,
        regions: Object.values(FRANCE_ID_TO_REGION),
    },
};

export const COUNTRY_LABELS: Record<CountryId, string> = {
    italy: "Itálie",
    germany: "Německo",
    austria: "Rakousko",
    france: "Francie",
};

export const COUNTRY_OUTLINES = countriesOutlines as CountryOutline[];

export function isCountryId(value: string | null | undefined): value is CountryId {
    return value === "italy" || value === "germany" || value === "austria" || value === "france";
}

export function parseCountryId(value: string | null | undefined): CountryId | null {
    return isCountryId(value) ? value : null;
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
