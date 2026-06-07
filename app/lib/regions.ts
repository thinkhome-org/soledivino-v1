import { toWineSlug } from "./wine-slug";

export function toRegionSlug(name: string): string {
    return toWineSlug(name);
}

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
